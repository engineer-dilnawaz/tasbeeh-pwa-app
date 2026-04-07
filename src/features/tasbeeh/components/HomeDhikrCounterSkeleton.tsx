/**
 * Loading skeleton for the Home Dhikr Counter.
 * Designed to match the geometry and layout of high-intent cards.
 */
export function HomeDhikrCounterSkeleton() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6 self-center pb-4 animate-pulse">
      
      {/* 1. Main Card Skeleton (Squircle-ish) */}
      <div className="w-full rounded-[24px] border border-base-300 bg-base-100 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          {/* Arabic Text placeholder */}
          <div className="skeleton h-8 w-3/4 rounded-lg"></div>
          {/* Transliteration placeholder */}
          <div className="skeleton h-4 w-1/2 rounded-md"></div>
          {/* Meaning placeholder */}
          <div className="skeleton h-4 w-2/3 rounded-md italic"></div>
          {/* Urdu placeholder */}
          <div className="skeleton h-3 w-1/3 rounded-sm"></div>
        </div>
      </div>

      {/* 2. Motivation Strip Skeleton */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="skeleton h-8 w-24 rounded-full"></div>
        <div className="skeleton h-8 w-32 rounded-full"></div>
      </div>

      {/* 3. Counter Section Skeleton */}
      <div className="relative flex flex-col items-center gap-3 mt-2">
        <div className="skeleton h-3 w-40 rounded-sm opacity-40"></div>
        
        {/* Large Progress Ring Circle */}
        <div className="flex size-[220px] items-center justify-center rounded-full bg-base-100 border-2 border-base-300 relative overflow-hidden">
             <div className="skeleton absolute inset-0 rounded-full opacity-10"></div>
             <div className="flex flex-col items-center gap-1">
                <div className="skeleton h-12 w-20 rounded-lg"></div>
                <div className="skeleton h-4 w-10 rounded-md"></div>
             </div>
        </div>
        
        {/* Taps left hint */}
        <div className="skeleton h-4 w-20 rounded-md opacity-50"></div>
      </div>

      {/* 4. Sequence List Skeleton */}
      <div className="w-full">
        <div className="skeleton mb-2 h-3 w-20 rounded-sm opacity-40"></div>
        <div className="flex flex-col gap-1.5 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-sm">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 bg-base-200/50">
               <div className="flex items-center gap-2 flex-1">
                  <div className="skeleton size-4 rounded-full"></div>
                  <div className="skeleton h-4 w-32 rounded-md"></div>
               </div>
               {i === 1 && <div className="skeleton size-3 rounded-full"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Actions Skeleton */}
      <div className="flex w-full gap-2 border-t border-base-300/60 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-11 flex-1 rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}
