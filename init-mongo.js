db.createUser({
    user: 'bezmakeup',
    pwd: 'Password123456',
    roles: [
        {
            role: 'readWrite',
            db: 'bezmakeup'
        }
    ]
})