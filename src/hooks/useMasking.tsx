export const useMasking = (email: string) => {
    let [user, domain] = email.split('@');

    user = user.replace(/.(?=.{5})/g, '*');

    return `${user}@${domain}`;
};
