// Politique de confidentialité, accessible dans l'app (exigence Apple/Google).
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { colors, font, space } from "@/theme/tokens";

const TEXT = `FORMA — Politique de confidentialité

Dernière mise à jour : 2026.

1. Données que nous collectons
Selon ton rôle : nom, prénom, numéro WhatsApp, poids, taille, mensurations, photos de progression, messages échangés avec ton coach, et données d'usage de l'application.

2. Pourquoi
Uniquement pour fournir le service de coaching : suivi de tes progrès, communication avec ton coach, gestion de ton abonnement.

3. Qui voit tes données
- Un élève ne voit que ses propres données.
- Un coach ne voit que les données de SES élèves.
- Le manageur voit les abonnements (coachs et élèves).
Ces règles sont appliquées côté serveur.

4. Sécurité
Tes données sont hébergées de façon sécurisée. Les codes et mots de passe sont chiffrés/hachés. Les échanges sont chiffrés (HTTPS).

5. Tes droits (RGPD)
Tu peux à tout moment, depuis l'app :
- exporter tes données,
- supprimer définitivement ton compte et toutes tes données.

6. Conservation
Tes données sont conservées tant que ton compte est actif. À la suppression du compte, elles sont effacées.

7. Contact
Pour toute question : contacte ton coach ou ton manageur, ou l'éditeur de l'application.`;

export default function PrivacyPolicy() {
  return (
    <ScrollView contentContainerStyle={styles.body}>
      <Text style={styles.text}>{TEXT}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { padding: space.xl, paddingBottom: 60 },
  text: { color: colors.textMuted, fontFamily: font.regular, fontSize: 14, lineHeight: 22 },
});
