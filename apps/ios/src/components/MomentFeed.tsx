import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { getUserById } from "../domain/data";
import type { Moment } from "../domain/types";
import { colors, space } from "../theme/tokens";
import { ActionRow, Avatar, Body, Button, Card, EmptyState, Title, fieldStyle } from "./ui";

export function MomentFeed({
  moments,
  currentUserId,
  onAdd,
}: {
  moments: Moment[];
  currentUserId: string;
  onAdd: (content: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);

  function submit() {
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft("");
    setOpen(false);
  }

  return (
    <View style={{ gap: space.sm }}>
      {open ? (
        <Card>
          <Title style={styles.prompt}>Was möchtest du der Runde hinterlassen?</Title>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Ein Satz reicht. Kein Feed, nur die Gruppe."
            placeholderTextColor={colors.muted}
            multiline
            style={styles.input}
          />
          <View style={{ marginTop: 10 }}>
            <ActionRow
              primary={
                <Button label="Teilen" haptic="success" onPress={submit} disabled={!draft.trim()} />
              }
              secondary={<Button label="Abbrechen" variant="ghost" onPress={() => setOpen(false)} />}
            />
          </View>
        </Card>
      ) : (
        <Button label="Eine Erinnerung hinterlassen" variant="secondary" onPress={() => setOpen(true)} />
      )}

      {moments.map((moment) => {
        const author = getUserById(moment.authorId);
        const when = new Date(moment.createdAt).toLocaleString("de-DE", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <Card key={moment.id} tone="soft">
            <View style={styles.head}>
              <Avatar initials={author?.initials ?? "?"} size={32} />
              <View style={{ flex: 1 }}>
                <Body style={styles.author}>
                  {author?.id === currentUserId ? "Du" : author?.name ?? "Mitglied"}
                </Body>
                <Body muted style={styles.when}>{when}</Body>
              </View>
            </View>
            {moment.type === "photo" ? (
              <Body style={styles.content}>📷 {moment.caption ?? "Ein Foto aus dem Kreis"}</Body>
            ) : (
              <Body style={styles.content}>{moment.content}</Body>
            )}
          </Card>
        );
      })}

      {moments.length === 0 && (
        <EmptyState
          kicker="Noch still"
          title="Der erste Satz darf klein sein"
          body="Kein Feed. Nur ein Satz für die Runde, wenn dir danach ist."
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  prompt: { marginBottom: space.xs },
  input: {
    ...fieldStyle,
    minHeight: 88,
    textAlignVertical: "top",
  },
  head: { flexDirection: "row", gap: 10, alignItems: "center" },
  author: { fontWeight: "600" },
  when: { fontSize: 13, lineHeight: 17 },
  content: { marginTop: 10 },
});
