import { notification } from "antd";

export const showErrorNotification = (error, defaultMessage = "Something went wrong") => {
    const message = error.response?.data?.message || defaultMessage;
    console.log(error);
    notification.error({
        message: "Error",
        description: message,
    });
};

export const showSuccessNotification = (message = "Success", description = "Operation completed successfully") => {
    notification.success({
        message: message,
        description: description,
    });
};

export const showInfoNotification = (message = "Information", description = "Here is some information") => {
    notification.info({
        message: message,
        description: description,
    });
};
