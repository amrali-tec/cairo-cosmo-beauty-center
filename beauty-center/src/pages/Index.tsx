import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title =
      "مركز القاهرة الطبي لجراحات التجميل والليزر | Cairo Cosmo Center";
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground text-sm">
        Loading Cairo Cosmo Center…
      </p>
    </div>
  );
};

export default Index;
