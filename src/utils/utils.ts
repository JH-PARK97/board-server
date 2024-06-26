import { User } from '@prisma/client';

export function exclude<Key extends keyof User>(user: User, keys: Key[]): Omit<User, Key> {
    return Object.fromEntries(Object.entries(user).filter(([key]) => !keys.includes(key as unknown as Key))) as Omit<
        User,
        Key
    >;
}
