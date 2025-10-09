export const GenderEnum = {
  MALE: "male",
  FEMALE: "female",
};

export const RoleEnum = {
    ADMIN: "admin",
    USER: "user",
    SUPER_ADMIN: "super_admin",
}

export const Privileges = {
    USER: [RoleEnum.USER],
    ADNIN:[RoleEnum.ADMIN],
    ADMINS: [RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN],
    SUPER_ADMIN: [RoleEnum.SUPER_ADMIN],
    ALL: [RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN],
    USER_ADMIN: [RoleEnum.USER, RoleEnum.ADMIN],
    USER_SUPER_ADMIN: [RoleEnum.USER, RoleEnum.SUPER_ADMIN],
}

export const ProvidersEnum = {
  LOCAL: "local",
  GOOGLE: "google",
}