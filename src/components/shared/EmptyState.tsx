
type EmptyStateProps = {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  imageSrc?: string;
};

export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
  imageSrc = '/aleman_parallax_assets/search.webp',
}: EmptyStateProps) {
  return (
    <div className="py-10 sm:py-14 text-center flex flex-col items-center justify-center">
      <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto relative flex items-center justify-center mb-4">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-contain filter drop-shadow-lg animate-in fade-in zoom-in-95 duration-300"
          loading="lazy"
          decoding="async"
        />
      </div>
      <h3 className="text-xl font-black text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-relaxed text-slate-500">{body}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 hover:bg-brand-600 px-6 py-2.5 text-sm font-black text-white shadow-sm transition hover:scale-105 active:scale-95"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );

}