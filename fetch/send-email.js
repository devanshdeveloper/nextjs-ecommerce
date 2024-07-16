import fetchApi from "@/utils/fetchApi";

export const sendEmail = async () => {
  return fetchApi("/api/send-email", {
    body: { to, subject, text },
  });
};
