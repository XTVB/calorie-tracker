import { User } from "../entities/User";

export const userIsAdmin = async (userId: number) => {
    const user = await User.findOne(userId);
    return user?.isAdmin
}