import { getSupabaseClient } from "./lib/supabaseClient";

export const revalidate = 0;

export default async function Home() {
  const { client: supabase, error: envError } = getSupabaseClient();
  const { data: images, error } = supabase
    ? await supabase
        .from("images")
        .select(
          "id, url, image_description, additional_context, celebrity_recognition, is_public, created_datetime_utc"
        )
        .order("created_datetime_utc", { ascending: false })
    : { data: null, error: { message: envError } };

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            Supabase Gallery
          </p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            Images
          </h1>
          <p className="max-w-2xl text-base text-slate-300">
            A live feed from the <span className="font-semibold">images</span>{" "}
            table in Supabase.
          </p>
        </header>

        {error ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-100">
            Failed to load images: {error.message}
          </div>
        ) : images && images.length > 0 ? (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <article
                key={image.id}
                className="group overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/60 shadow-lg shadow-slate-950/40"
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-800">
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={image.image_description || "Supabase image"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      No image URL
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                    <span>{image.is_public ? "Public" : "Private"}</span>
                    <span>
                      {image.created_datetime_utc
                        ? new Date(image.created_datetime_utc).toLocaleDateString()
                        : "Unknown date"}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    {image.image_description || "Untitled image"}
                  </h2>
                  {image.additional_context ? (
                    <p className="text-sm text-slate-300">
                      {image.additional_context}
                    </p>
                  ) : null}
                  {image.celebrity_recognition ? (
                    <p className="text-xs text-slate-400">
                      Recognition: {image.celebrity_recognition}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6 text-slate-200">
            No images found in the table yet.
          </div>
        )}
      </div>
    </main>
  );
}
