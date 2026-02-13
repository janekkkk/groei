import { CheckCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { classNames } from "@/shared/utils";

type SavingStatus = "saving" | "saved" | null;

interface SavingIndicatorProps {
  status: SavingStatus;
}

export const SavingIndicator = ({ status }: SavingIndicatorProps) => {
  const { t } = useTranslation();

  if (!status) return null;

  return (
    <div
      className={classNames(
        "fixed right-4 bottom-4 flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-sm",
        {
          "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100":
            status === "saving",
          "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100":
            status === "saved",
        },
      )}
    >
      {status === "saving" && (
        <>
          <RefreshCw className="h-4 w-4 animate-spin" />
          {t("core.saving")}
        </>
      )}
      {status === "saved" && (
        <>
          <CheckCircle className="h-4 w-4" />
          {t("core.saved")}
        </>
      )}
    </div>
  );
};
