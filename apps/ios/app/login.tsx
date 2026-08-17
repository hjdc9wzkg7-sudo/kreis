import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Atmosphere } from "@/src/components/glass";
import { Body, Button, Display, Kicker, fieldStyle } from "@/src/components/ui";
import { signInWithEmail, verifyEmailOtp } from "@/src/lib/auth";
import { useAuth } from "@/src/lib/useAuth";
import { colors, space } from "@/src/theme/tokens";

export default function LoginScreen() {
  const { session } = useAuth();
  const codeRef = useRef<TextInput>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) router.replace("/");
  }, [session]);

  useEffect(() => {
    if (!sent) return;
    const timer = setTimeout(() => codeRef.current?.focus(), 180);
    return () => clearTimeout(timer);
  }, [sent]);

  async function sendCode() {
    setError(null);
    if (!email.includes("@")) {
      setError("Bitte eine gültige E-Mail eingeben.");
      return;
    }
    Keyboard.dismiss();
    setBusy(true);
    const { error: next } = await signInWithEmail(email);
    setBusy(false);
    if (next) {
      setError(next.message);
      return;
    }
    setSent(true);
    setCode("");
  }

  async function confirmCode() {
    setError(null);
    if (code.trim().length < 6) {
      setError("Der Code hat sechs Stellen.");
      return;
    }
    Keyboard.dismiss();
    setBusy(true);
    const { error: next } = await verifyEmailOtp(email, code);
    setBusy(false);
    if (next) {
      setError(next.message);
      return;
    }
    router.replace("/");
  }

  return (
    <Atmosphere>
      <SafeAreaView style={styles.flex} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Pressable style={styles.inner} onPress={Keyboard.dismiss}>
              <View style={styles.hero} pointerEvents="none">
                <Kicker clay style={styles.centerText}>
                  KREIS
                </Kicker>
                <Display style={styles.centerText}>
                  {sent ? "Dein Code" : "Mit E-Mail eintreten"}
                </Display>
                <Body muted style={styles.lead}>
                  {sent
                    ? `Geschickt an ${email}`
                    : "Wir schicken dir einen Code. Kein Passwort, keine offenen DMs."}
                </Body>
              </View>

              <View style={styles.form}>
                {!sent ? (
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="du@beispiel.de"
                    placeholderTextColor={colors.muted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    editable={!busy}
                    style={styles.input}
                    accessibilityLabel="E-Mail"
                    returnKeyType="done"
                    onSubmitEditing={() => void sendCode()}
                  />
                ) : (
                  <TextInput
                    ref={codeRef}
                    value={code}
                    onChangeText={setCode}
                    placeholder="000000"
                    placeholderTextColor={colors.muted}
                    keyboardType="number-pad"
                    autoComplete="one-time-code"
                    textContentType="oneTimeCode"
                    maxLength={8}
                    editable={!busy}
                    style={[styles.input, styles.codeInput]}
                    accessibilityLabel="Bestätigungscode"
                    returnKeyType="done"
                    onSubmitEditing={() => void confirmCode()}
                  />
                )}
                <View pointerEvents="none">
                  {error ? (
                    <Body style={styles.error}>{error}</Body>
                  ) : sent ? (
                    <Body muted style={styles.hint}>
                      Kein Code da? Schau einmal im Spam nach.
                    </Body>
                  ) : null}
                </View>
                <Button
                  label={busy ? "Bitte warten…" : sent ? "Code prüfen" : "Code senden"}
                  disabled={busy}
                  onPress={() => void (sent ? confirmCode() : sendCode())}
                />
                {sent ? (
                  <Button
                    label="Anderen Code senden"
                    variant="ghost"
                    disabled={busy}
                    onPress={() => void sendCode()}
                  />
                ) : null}
              </View>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: space.lg,
    paddingTop: 12,
    paddingBottom: 24,
  },
  inner: {
    flexGrow: 1,
    justifyContent: "flex-start",
    gap: 20,
  },
  hero: { gap: 6, alignItems: "center" },
  centerText: { textAlign: "center" },
  lead: { marginTop: 2, textAlign: "center", alignSelf: "stretch" },
  form: { gap: 12 },
  input: {
    ...fieldStyle,
    textAlign: "center",
  },
  codeInput: {
    letterSpacing: 8,
    fontSize: 28,
    fontWeight: "600",
    paddingVertical: 18,
  },
  hint: { textAlign: "center" },
  error: { color: colors.danger, textAlign: "center" },
});
