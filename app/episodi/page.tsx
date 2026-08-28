import { redirect } from "next/navigation";

// L'archivio si è trasferito su /youtube (i video del canale).
// Le singole storie restano su /episodi/[slug]: qui reindirizziamo solo l'indice.
export default function EpisodiIndexRedirect() {
  redirect("/youtube");
}
