package com.riverstorm.game;

import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import androidx.core.content.FileProvider;
import androidx.core.content.pm.PackageInfoCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Locale;

@CapacitorPlugin(name = "RiverUpdate")
public class RiverUpdate extends Plugin {
    private static final String RELEASES = "https://github.com/JorgeNovoJulho/river-assault-reimagined/releases/";
    private static final long MAX_APK = 350L * 1024 * 1024;

    private PackageInfo installedInfo(int flags) throws Exception {
        return getContext().getPackageManager().getPackageInfo(getContext().getPackageName(), flags);
    }

    private HttpURLConnection connect(String address) throws Exception {
        URL url = new URL(address);
        for (int i = 0; i < 5; i++) {
            String host = url.getHost();
            if (!url.getProtocol().equals("https") || url.getUserInfo() != null ||
                (url.getPort() != -1 && url.getPort() != 443) ||
                !(host.equals("github.com") || host.equals("release-assets.githubusercontent.com") ||
                  host.equals("objects.githubusercontent.com"))) throw new SecurityException("Servidor de atualização inválido");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setInstanceFollowRedirects(false);
            connection.setConnectTimeout(15000);
            connection.setReadTimeout(30000);
            int status = connection.getResponseCode();
            if (status == 200) return connection;
            String next = connection.getHeaderField("Location");
            connection.disconnect();
            if (status >= 300 && status < 400 && next != null) {
                url = new URL(url, next);
                continue;
            }
            throw new java.io.IOException("GitHub HTTP " + status);
        }
        throw new java.io.IOException("Redirecionamentos excessivos");
    }

    private JSONObject release() throws Exception {
        HttpURLConnection connection = connect(RELEASES + "latest/download/android-update.json");
        try (InputStream in = connection.getInputStream(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096];
            int n;
            while ((n = in.read(buffer)) != -1) {
                if (out.size() + n > 65536) throw new java.io.IOException("Manifesto excede o limite");
                out.write(buffer, 0, n);
            }
            JSONObject release = new JSONObject(new String(out.toByteArray(), StandardCharsets.UTF_8));
            String version = release.getString("version");
            if (!version.matches("(0|[1-9][0-9]{0,3})\\.(0|[1-9][0-9]{0,2})\\.(0|[1-9][0-9]{0,2})") ||
                !release.getString("sha256").matches("[a-f0-9]{64}")) throw new SecurityException("Manifesto inválido");
            String[] parts = version.split("\\.");
            long code = Long.parseLong(parts[0]) * 1000000 + Long.parseLong(parts[1]) * 1000 + Long.parseLong(parts[2]);
            if (code != release.getLong("versionCode") || code < 1 || code > 2100000000L)
                throw new SecurityException("Número de versão inválido");
            return release;
        } finally { connection.disconnect(); }
    }

    @PluginMethod
    public void installed(PluginCall call) {
        try { call.resolve(new JSObject().put("currentVersion", installedInfo(0).versionName)); }
        catch (Exception error) { call.reject("Versão instalada indisponível", error); }
    }

    @PluginMethod
    public void check(PluginCall call) {
        new Thread(() -> {
            try {
                PackageInfo local = installedInfo(0);
                JSONObject release = release();
                JSObject info = new JSObject().put("currentVersion", local.versionName);
                if (release.getLong("versionCode") > PackageInfoCompat.getLongVersionCode(local)) {
                    info.put("version", release.getString("version"));
                }
                call.resolve(info);
            } catch (Exception error) { call.reject("Verificação indisponível", error); }
        }).start();
    }

    @PluginMethod
    public void install(PluginCall call) {
        if (Build.VERSION.SDK_INT >= 26 && !getContext().getPackageManager().canRequestPackageInstalls()) {
            Intent permission = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                Uri.parse("package:" + getContext().getPackageName()));
            getActivity().runOnUiThread(() -> {
                try {
                    getActivity().startActivity(permission);
                    call.resolve(new JSObject().put("permissionRequired", true));
                } catch (Exception error) { call.reject("Permissão de instalação indisponível", error); }
            });
            return;
        }
        new Thread(() -> downloadAndOpen(call)).start();
    }

    @SuppressWarnings("deprecation")
    private void downloadAndOpen(PluginCall call) {
        File apk = null;
        try {
            JSONObject release = release();
            String version = release.getString("version");
            long versionCode = release.getLong("versionCode");
            PackageInfo local = installedInfo(PackageManager.GET_SIGNATURES);
            if (!version.equals(call.getString("version")) || versionCode <= PackageInfoCompat.getLongVersionCode(local))
                throw new SecurityException("Verifique novamente a versão disponível");

            File directory = new File(getContext().getCacheDir(), "river-updates");
            if (!directory.isDirectory() && !directory.mkdirs()) throw new java.io.IOException("Cache indisponível");
            apk = File.createTempFile("riverstorm-", ".apk", directory);
            HttpURLConnection connection = connect(RELEASES + "download/v" + version + "/riverstorm-android.apk");
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            try (InputStream in = connection.getInputStream(); FileOutputStream out = new FileOutputStream(apk)) {
                byte[] buffer = new byte[65536];
                long total = 0;
                int n;
                while ((n = in.read(buffer)) != -1) {
                    total += n;
                    if (total > MAX_APK) throw new java.io.IOException("APK excede o limite");
                    digest.update(buffer, 0, n);
                    out.write(buffer, 0, n);
                }
            } finally { connection.disconnect(); }
            StringBuilder hash = new StringBuilder();
            for (byte value : digest.digest()) hash.append(String.format(Locale.ROOT, "%02x", value & 0xff));
            if (!hash.toString().equals(release.getString("sha256"))) throw new SecurityException("SHA-256 inválido");

            PackageInfo candidate = getContext().getPackageManager().getPackageArchiveInfo(apk.getPath(), PackageManager.GET_SIGNATURES);
            if (candidate == null || !local.packageName.equals(candidate.packageName) ||
                !version.equals(candidate.versionName) || versionCode != PackageInfoCompat.getLongVersionCode(candidate) ||
                local.signatures == null || candidate.signatures == null || candidate.signatures.length == 0 ||
                !new HashSet<>(Arrays.asList(local.signatures)).equals(new HashSet<>(Arrays.asList(candidate.signatures)))) {
                throw new SecurityException("O APK não corresponde ao jogo instalado ou à sua assinatura");
            }
            Uri uri = FileProvider.getUriForFile(getContext(), local.packageName + ".fileprovider", apk);
            Intent installer = new Intent(Intent.ACTION_VIEW).setDataAndType(uri, "application/vnd.android.package-archive")
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            File verified = apk;
            getActivity().runOnUiThread(() -> {
                try {
                    getActivity().startActivity(installer);
                    call.resolve();
                } catch (Exception error) {
                    verified.delete();
                    call.reject("Instalador Android indisponível", error);
                }
            });
        } catch (Exception error) {
            if (apk != null) apk.delete();
            call.reject("Não foi possível validar ou baixar o APK", error);
        }
    }
}
