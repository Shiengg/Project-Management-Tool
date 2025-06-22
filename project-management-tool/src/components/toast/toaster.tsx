// import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { formatDate } from "@/lib/format";
import { Notification } from "@/lib/types";
import { Divide } from "lucide-react";
import { toast } from "sonner";
// import { formattedDateTime } from "./format";

export const toastSuccess = (message: string) => {
  toast.success(message);
};

export const toastWarning = (message: string) => {
  toast.warning(message);
};

export const toastError = (message: string) => {
  toast.error(message);
};

export const toastRequest = (message: string) => {
  return new Promise((resolve) => {
    toast(message, {
      action: {
        label: "Yes",
        onClick: () => {
          resolve(true);
        },
      },
    });
    setTimeout(() => {
      resolve(false);
    }, 5000);
  });
};

export const toastNotification = (notification: Notification) => {
  toast.message("You have 1 new invitation", {
    description: formatDate(notification.createdAt),
  });
};
