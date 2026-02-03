import { Zap } from "lucide-react";
export default function SideBarHeader() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-base lg:text-lg font-semibold text-foreground">
            ELD Simulator
          </h1>
          <p className="text-xs text-muted-foreground">Fleet Management Pro</p>
        </div>
      </div>
    </div>
  );
}
