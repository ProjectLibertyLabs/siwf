- provider to control panel
    await signInWithFrequency({})
   
    signLogin vs signUp payload
    signLogin
    
    From provider to proxy
        {
            providerId: string,
            schemas: [Schema],
            siwsOptions: {
                statement?: string,
                requestId?: string // any value that 
                resources?: [URL]
                expirationTimeOffsetSeconds: number, //expiration time is how long its valid for after its signed 
                notBefore?: number // milliseconds date  
            },
        }
    From Proxy to Provider login happy path
    {
        isSignedIn: bool,
        siwsPayload: {
            signature: string,
            payload: {}, // reference talisman library (siws message)
        },
        signup: {
            public_key: string,
            handle: {
                payload: ClaimHandlePayload,
                signature: string
            },
            delgation: {
                isNewAccount: bool,
                payload: addProviderPayload,
                signature: {}
            },
        }
    }
    
    From Proxy to Provider login unhappy (close window)

    signup
    {

    }


# todo
- add ticket to be able to allow providers to pass in a message to be displayed in sign in with substrate signature payload.

# todo
- investigate what happens in the case user closes the popup before
completing the sign-in/sign-up flow.

# todo
validate that both signature are signed with the same key for sign up