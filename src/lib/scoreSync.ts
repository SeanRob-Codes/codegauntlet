import { supabase } from "@/integrations/supabase/client";

// Track language attempts/corrects for the signed-in user.
export async function recordLanguageAttempt(language: string, correct: boolean) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("language_scores")
    .select("*")
    .eq("user_id", user.id)
    .eq("language", language)
    .maybeSingle();

  if (existing) {
    await supabase.from("language_scores").update({
      total_attempts: existing.total_attempts + 1,
      total_correct: existing.total_correct + (correct ? 1 : 0),
      updated_at: new Date().toISOString(),
    }).eq("user_id", user.id).eq("language", language);
  } else {
    await supabase.from("language_scores").insert({
      user_id: user.id,
      language,
      total_attempts: 1,
      total_correct: correct ? 1 : 0,
      best_score: 0,
    });
  }
}

export async function recordRunBestScore(score: number, languages: string[]) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !languages.length) return;
  // distribute as a per-language best — mark each selected language with best_score = max(existing, score)
  for (const lang of languages) {
    const { data: existing } = await supabase
      .from("language_scores").select("best_score")
      .eq("user_id", user.id).eq("language", lang).maybeSingle();
    if (existing) {
      if (score > existing.best_score) {
        await supabase.from("language_scores").update({ best_score: score }).eq("user_id", user.id).eq("language", lang);
      }
    } else {
      await supabase.from("language_scores").insert({ user_id: user.id, language: lang, best_score: score });
    }
  }
}
