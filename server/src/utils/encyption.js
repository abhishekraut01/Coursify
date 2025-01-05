import bcrypt from 'bcryptjs'

export const handleHashPassword = async (password) =>{
    const saltRound = 10;
    const hashPass = await bcrypt.hash(password , saltRound)
    return hashPass
}

