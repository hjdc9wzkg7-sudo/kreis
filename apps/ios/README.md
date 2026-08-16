# KREIS für iOS

Native iOS-App für kleine, wiederkehrende Kreise statt eines endlosen Feeds.

## Voraussetzungen

- Node.js 18+
- iPhone mit [Expo Go](https://apps.apple.com/app/expo-go/id982107779) aus dem App Store (aktuell SDK **54**)
- macOS + Xcode nur für lokale Native-Builds
- [EAS Build](https://docs.expo.dev/build/introduction/) für eine IPA in der Cloud

Dieses Projekt nutzt **Expo SDK 54**, weil die App-Store-Version von Expo Go auf dem iPhone dort steht. Neuere SDKs (55–57) laufen dort nicht.

Auf Windows kann die App in Expo Go getestet werden. Eine lokale `npm run ios`-Kompilierung braucht macOS.

## Starten

```bash
cd apps/ios
npm install
npm start
```

Dann im Terminal `i` ist nur auf dem Mac verfügbar. Auf Windows:

1. Expo Go auf dem iPhone öffnen
2. denselben WLAN-Zugang nutzen
3. den QR-Code scannen

Web-Vorschau der gleichen App:

```bash
npm run web
```

## iOS-Build (Cloud)

```bash
npx eas-cli login
npx eas-cli init
npx eas-cli build --platform ios --profile preview
```

Bundle-ID: `app.kreis.social`

## Struktur

```
app/                     Expo Router
  (onboarding)/          18+ und Intention
  (tabs)/                Heute, Entdecken, Kreise, Profil
  kreis/[id].tsx         Saison, RSVP, Momente, Melden
  host-kits.tsx
  sicherheit.tsx
src/
  domain/                Typen, Pilotdaten, erklärbares Matching
  state/                 persistenter App-State
  components/            iOS-UI
  theme/                 Farben und Typo
```
