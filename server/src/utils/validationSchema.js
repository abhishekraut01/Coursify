import zod from 'zod'

export const SignUpSchema = zod.object({
    username:zod.string().min(3),
    email:zod.string().min(11),
    password:zod.string().min(8)
})

export const loginSchema = zod.object({
    username:zod.string().min(3),
    password:zod.string().min(8)
})
