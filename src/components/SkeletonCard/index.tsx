import { Skeleton } from "@heroui/react";

export default function HotRankSkeleton() {
  return (
    <div className="w-full px-4 py-3 space-y-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-3 py-1"
        >
          {/* 左侧 */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* 排名 */}
            <Skeleton animationType="shimmer" className="h-6 w-6 rounded-md shrink-0" />

            {/* 标题 */}
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton animationType="shimmer"
                className={`h-4 rounded-md ${index === 0
                  ? "w-full"
                  : index === 1
                    ? "w-5/6"
                    : index === 2
                      ? "w-4/5"
                      : index % 2
                        ? "w-3/4"
                        : "w-full"
                  }`}
              />
            </div>
          </div>

          {/* 右侧热度 */}
          <Skeleton animationType="shimmer"
            className={`h-4 rounded-md shrink-0 ${index < 3 ? "w-12" : "w-10"
              }`}
          />
        </div>
      ))}
    </div>
  );
}