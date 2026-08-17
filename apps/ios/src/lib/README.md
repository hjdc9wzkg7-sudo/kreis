# Supabase (KREIS)

Client: `supabase.ts`  
Auth-Helfer: `auth.ts`

## Was hier liegt

- **Project URL** und **anon key** (öffentlich, für die App gedacht).
- Session bleibt in AsyncStorage (`persistSession`, `autoRefreshToken`).

## Was hier nicht liegen darf

- Kein `service_role`-Key.
- Keine Datenbank-Passwörter.

## E-Mail muss einen Code schicken, keinen Link

`signInWithOtp` erzeugt immer beides. Was in der Mail steht, steuert das **Dashboard**, nicht die App.

Ohne diese Vorlagen schickt Supabase bei neuen Accounts die Standard-Mail „Confirm your email address“ mit einem Link nach `http://localhost:3000`. Den kann man auf dem Handy nicht öffnen.

Direkt:

- [E-Mail-Vorlagen](https://supabase.com/dashboard/project/tvnbxvjnyztawnwobqxf/auth/templates)
- [E-Mail-Provider](https://supabase.com/dashboard/project/tvnbxvjnyztawnwobqxf/auth/providers)

### 1. Confirm email aus

Authentication → Sign In / Providers → Email → **Confirm email** aus.

Die App bestätigt die Adresse über den Code. Eine extra Link-Mail ist überflüssig und landet auf localhost.

### 2. Beide Vorlagen auf den Code umstellen

**Confirm sign up** und **Magic Link / OTP**, jeweils Speichern.

Betreff:

```
Dein KREIS-Code: {{ .Token }}
```

Inhalt:

```html
<h2>Dein KREIS-Code</h2>
<p>Gib diesen Code in der App ein:</p>
<p style="font-size:32px;letter-spacing:6px;font-weight:600;">{{ .Token }}</p>
<p>Falls du das nicht warst, kannst du diese Mail ignorieren.</p>
```

Wichtig: `{{ .Token }}` muss drin sein. `{{ .ConfirmationURL }}` weglassen, sonst kommt wieder nur der localhost-Link.

### 3. Neuen Code anfordern

Alte Mails bleiben Links. Nicht darauf tippen — der Link verbraucht den Token und öffnet localhost. In der App erneut „Anderen Code senden“.

## Als Nächstes

Tabellen (users/circles/meetups/rsvps/…) in Supabase anlegen und **RLS** einschalten. Ohne RLS darf der anon key nichts Sensibles lesen.
