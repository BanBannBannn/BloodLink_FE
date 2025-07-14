import type { User } from "@/contexts/AuthContext";

export const validateUserInfor = (user: User) => {
  if (
    user.email &&
    user.fullName &&
    user.phoneNo &&
    user.addresss &&
    user.identityId &&
    user.dateOfBirth &&
    user.frontUrlIdentity &&
    user.backUrlIdentity &&
    user.gender !== undefined
  ) {
    return true;
  }
  return false;
};

export const stripHtml = (html: string): string => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}
