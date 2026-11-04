const fs = require('fs');
const path = require('path');
const {
  withDangerousMod,
  withAndroidManifest,
  withMainApplication,
  withStringsXml,
  AndroidConfig,
} = require('@expo/config-plugins');

const NATIVE_ROOT = path.join(__dirname, '..', 'native-android');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
    }
  }
}

function ensureUsesPermission(androidManifest, name) {
  const app = androidManifest.manifest;
  if (!app['uses-permission']) {
    app['uses-permission'] = [];
  }
  const exists = app['uses-permission'].some((p) => p.$?.['android:name'] === name);
  if (!exists) {
    app['uses-permission'].push({ $: { 'android:name': name } });
  }
}

const withParentGuardNative = (config) => {
  config = withStringsXml(config, (cfg) => {
    cfg.modResults = AndroidConfig.Strings.setStringItem(
      [
        {
          _: 'ParentGuard needs Accessibility access to detect blocked apps in the foreground.',
          $: { name: 'parentguard_accessibility_description' },
        },
      ],
      cfg.modResults,
    );
    return cfg;
  });

  config = withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults;
    const permissions = [
      'android.permission.PACKAGE_USAGE_STATS',
      'android.permission.SYSTEM_ALERT_WINDOW',
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.FOREGROUND_SERVICE_SPECIAL_USE',
      'android.permission.RECEIVE_BOOT_COMPLETED',
      'android.permission.POST_NOTIFICATIONS',
      'android.permission.QUERY_ALL_PACKAGES',
      'android.permission.WAKE_LOCK',
    ];
    permissions.forEach((p) => ensureUsesPermission(manifest, p));

    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);

    const serviceNodes = application.service ?? [];
    const hasAccessibility = serviceNodes.some(
      (s) => s.$?.['android:name'] === 'com.parentguard.accessibility.ParentGuardAccessibilityService',
    );
    if (!hasAccessibility) {
      serviceNodes.push({
        $: {
          'android:name': 'com.parentguard.accessibility.ParentGuardAccessibilityService',
          'android:permission': 'android.permission.BIND_ACCESSIBILITY_SERVICE',
          'android:exported': 'true',
        },
        'intent-filter': [
          {
            action: [
              {
                $: {
                  'android:name': 'android.accessibilityservice.AccessibilityService',
                },
              },
            ],
          },
        ],
        'meta-data': [
          {
            $: {
              'android:name': 'android.accessibilityservice',
              'android:resource': '@xml/parentguard_accessibility_service',
            },
          },
        ],
      });
    }

    const hasMonitor = serviceNodes.some(
      (s) => s.$?.['android:name'] === 'com.parentguard.usage.MonitoringForegroundService',
    );
    if (!hasMonitor) {
      serviceNodes.push({
        $: {
          'android:name': 'com.parentguard.usage.MonitoringForegroundService',
          'android:exported': 'false',
          'android:foregroundServiceType': 'specialUse',
        },
        property: [
          {
            $: {
              'android:name': 'android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE',
              'android:value': 'parental_control_monitoring',
            },
          },
        ],
      });
    }

    application.service = serviceNodes;

    // Allow querying installed apps for restriction management.
    if (!manifest.manifest.queries) {
      manifest.manifest.queries = [{ intent: [] }];
    }
    const queries = manifest.manifest.queries[0];
    if (!queries.intent) {
      queries.intent = [];
    }
    queries.intent.push({
      action: [{ $: { 'android:name': 'android.intent.action.MAIN' } }],
      category: [{ $: { 'android:name': 'android.intent.category.LAUNCHER' } }],
    });

    return cfg;
  });

  config = withMainApplication(config, (cfg) => {
    let contents = cfg.modResults.contents;
    if (!contents.includes('import com.parentguard.modules.ParentGuardPackage')) {
      if (contents.includes('import expo.modules.ExpoReactHostFactory')) {
        contents = contents.replace(
          'import expo.modules.ExpoReactHostFactory',
          'import expo.modules.ExpoReactHostFactory\nimport com.parentguard.modules.ParentGuardPackage',
        );
      } else if (contents.includes('import expo.modules.ReactNativeHostWrapper')) {
        contents = contents.replace(
          'import expo.modules.ReactNativeHostWrapper',
          'import expo.modules.ReactNativeHostWrapper\nimport com.parentguard.modules.ParentGuardPackage',
        );
      } else {
        contents = `import com.parentguard.modules.ParentGuardPackage\n${contents}`;
      }
    }
    if (!contents.includes('add(ParentGuardPackage())')) {
      if (contents.includes('PackageList(this).packages.apply')) {
        contents = contents.replace(
          /PackageList\(this\)\.packages\.apply\s*\{/,
          `PackageList(this).packages.apply {\n              add(ParentGuardPackage())`,
        );
      } else if (contents.includes('packages = PackageList(this).packages')) {
        contents = contents.replace(
          'packages = PackageList(this).packages',
          'packages = PackageList(this).packages.apply { add(ParentGuardPackage()) }',
        );
      }
    }
    cfg.modResults.contents = contents;
    return cfg;
  });

  config = withDangerousMod(config, [
    'android',
    async (cfg) => {
      const projectRoot = cfg.modRequest.platformProjectRoot;
      const javaRoot = path.join(
        projectRoot,
        'app',
        'src',
        'main',
        'java',
        'com',
        'parentguard',
      );
      const resRoot = path.join(projectRoot, 'app', 'src', 'main', 'res');

      copyDir(path.join(NATIVE_ROOT, 'accessibility'), path.join(javaRoot, 'accessibility'));
      copyDir(path.join(NATIVE_ROOT, 'overlay'), path.join(javaRoot, 'overlay'));
      copyDir(path.join(NATIVE_ROOT, 'usage'), path.join(javaRoot, 'usage'));
      copyDir(path.join(NATIVE_ROOT, 'modules'), path.join(javaRoot, 'modules'));
      copyDir(path.join(NATIVE_ROOT, 'res'), resRoot);

      // Ensure androidx.core is available for NotificationCompat.
      const appBuildGradle = path.join(projectRoot, 'app', 'build.gradle');
      if (fs.existsSync(appBuildGradle)) {
        let gradle = fs.readFileSync(appBuildGradle, 'utf8');
        if (!gradle.includes('androidx.core:core-ktx')) {
          gradle = gradle.replace(
            /dependencies\s*\{/,
            `dependencies {\n    implementation("androidx.core:core-ktx:1.15.0")`,
          );
          fs.writeFileSync(appBuildGradle, gradle);
        }
      }

      return cfg;
    },
  ]);

  return config;
};

module.exports = withParentGuardNative;
