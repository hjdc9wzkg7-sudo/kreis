import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { getUserById } from "../domain/data";
import type { Moment } from "../domain/types";
import { colors, space, type } from "../theme/tokens";
import { ActionRow, Avatar, Button, Card } from "./ui";

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
    <View style={{ gap: 12 }}>
      {open ? (
        <Card>
          <Text style={styles.prompt}>Was möchtest du der Runde hinterlassen?</Text>
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
                <Button label="Teilen" onPress={submit} disabled={!draft.trim()} />
              }
              secondary={<Button label="Abbrechen" variant="secondary" onPress={() => setOpen(false)} />}
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
          <Card key={moment.id}>
            <View style={styles.head}>
              <Avatar initials={author?.initials ?? "?"} size={32} />
              <View style={{ flex: 1 }}>
                <Text style={styles.author}>
                  {author?.id === currentUserId ? "Du" : author?.name ?? "Mitglied"}
                </Text>
                <Text style={styles.when}>{when}</Text>
              </View>
            </View>
            {moment.type === "photo" ? (
              <Text style={styles.content}>📷 {moment.caption ?? "Ein Foto aus dem Kreis"}</Text>
            ) : (
              <Text style={styles.content}>{moment.content}</Text>
            )}
          </Card>
        );
      })}

      {moments.length === 0 && (
        <Text style={styles.empty}>Noch still hier. Der erste Satz darf klein sein.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  prompt: { ...type.subtitle, color: colors.ink, marginBottom: 8 },
  input: {
    minHeight: 88,
    color: colors.ink,
    fontSize: type.body.fontSize,
    lineHeight: type.body.lineHeight,
    textAlignVertical: "top",
  },
  head: { flexDirection: "row", gap: 10, alignItems: "center" },
  author: { ...type.callout, color: colors.ink },
  when: { ...type.caption, color: colors.muted },
  content: { marginTop: 10, ...type.body, color: colors.ink },
  empty: { ...type.body, textAlign: "center", color: colors.muted, paddingVertical: space.lg },
});
