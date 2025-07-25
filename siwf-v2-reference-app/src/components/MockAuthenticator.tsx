import React, { useState } from 'react';
import { User, Mail, Lock, Key, CheckCircle, Loader, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface MockAuthenticatorProps {
  signedRequest: string;
  onSuccess: (result: any) => void;
  onCancel: () => void;
  onStart?: () => void;
}

interface AuthCredentials {
  email: string;
  password: string;
  handle?: string;
}

export const MockAuthenticator: React.FC<MockAuthenticatorProps> = ({
  signedRequest,
  onSuccess,
  onCancel,
  onStart
}) => {
  const [authMode, setAuthMode] = useState<'choose' | 'login' | 'signup'>('choose');
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState<AuthCredentials>({
    email: '',
    password: '',
    handle: ''
  });

  // Call onStart when user begins authentication process
  const handleModeSelect = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    onStart?.(); // Notify parent component that auth has started
  };

  const generateMockAuthData = (userEmail: string, userHandle?: string) => {
    // Generate mock authorizationCode and authorizationPayload as requested
    const mockAuthorizationCode = `680a0a68-6d3b-4d6d-89b7-0b01a6f7e86f`;
    
    const mockAuthorizationPayload = `eyJ1c2VyUHVibGljS2V5Ijp7ImVuY29kZWRWYWx1ZSI6ImY2YWt1ZmtxOUxleDZyVDhSQ0VEUnVvWlFSZ281cFdpUnplbzgxbm1LTkdXR05KZEoiLCJlbmNvZGluZyI6ImJhc2U1OCIsImZvcm1hdCI6InNzNTgiLCJ0eXBlIjoiU3IyNTUxOSJ9LCJwYXlsb2FkcyI6W3sic2lnbmF0dXJlIjp7ImFsZ28iOiJTUjI1NTE5IiwiZW5jb2RpbmciOiJiYXNlMTYiLCJlbmNvZGVkVmFsdWUiOiIweGNjNDY5Y2U1MzA0NzY4YzE2MTY0ZTQyNDQyZGZlNDA3NjlhNzQyNzg2YmQzNjBjYWJiOGZkYWYxNWEyNTc2NWM5YzE4ZDcxYjhjODg5NzJmNDJhYjZmOTM4ZTcwM2Y0Y2M0MDM1NjU2YTdjOWRkMTkzYWNhMjYyNmEzZDdmODg3In0sImVuZHBvaW50Ijp7InBhbGxldCI6Im1zYSIsImV4dHJpbnNpYyI6ImNyZWF0ZVNwb25zb3JlZEFjY291bnRXaXRoRGVsZWdhdGlvbiJ9LCJ0eXBlIjoiYWRkUHJvdmlkZXIiLCJwYXlsb2FkIjp7ImF1dGhvcml6ZWRNc2FJZCI6MSwic2NoZW1hSWRzIjpbNSw3LDgsOSwxMF0sImV4cGlyYXRpb24iOjI0fX0seyJzaWduYXR1cmUiOnsiYWxnbyI6IlNSMjU1MTkiLCJlbmNvZGluZyI6ImJhc2UxNiIsImVuY29kZWRWYWx1ZSI6IjB4OTA1ODNlOGMyYmRiNDZhZmQ2MmNhZWQ5NGViMmY2Yzk5ZjY2MzA4YTkxNTkxZGExNDQ3ZDJlZjc4MTAwMjYyMmVmMTJiOTYwZmM4NmRlODgxMjFlMjQzYWQzY2Y1ZTE1YTYxNWQ0OGU3YzJlMjBjODYwYTdhZGY2MTk5Y2ZiODgifSwiZW5kcG9pbnQiOnsicGFsbGV0Ijoic3RhdGVmdWxTdG9yYWdlIiwiZXh0cmluc2ljIjoiYXBwbHlJdGVtQWN0aW9uc1dpdGhTaWduYXR1cmVWMiJ9LCJ0eXBlIjoiaXRlbUFjdGlvbnMiLCJwYXlsb2FkIjp7InNjaGVtYUlkIjo3LCJ0YXJnZXRIYXNoIjowLCJleHBpcmF0aW9uIjoyMCwiYWN0aW9ucyI6W3sidHlwZSI6ImFkZEl0ZW0iLCJwYXlsb2FkSGV4IjoiMHg0MGVlYTFlMzlkMmYxNTQ1ODRjNGIxY2E4ZjIyOGJiNDlhZTVhMTQ3ODZlZDYzYzkwMDI1ZTc1NWYxNmJkNThkMzcifV19fSx7InNpZ25hdHVyZSI6eyJhbGdvIjoiU1IyNTUxOSIsImVuY29kaW5nIjoiYmFzZTE2IiwiZW5jb2RlZFZhbHVlIjoiMHhhMjkxYjIyZjZkM2UyMTI1ODIwMGYxMjdlYTIzYjc0MTI0OGE1ODQyMDhkOTY3ODNmYjM1OTlhNzMzYTg3YzJlNjdmZTQyNzQ5MWE2YWE5ODRlMzk4MmU1Y2NhZmNiYjdmMTcwYTE3YTVkYjYwODIyMzBhMWM4ZTRhYzJhM2Y4YyJ9LCJlbmRwb2ludCI6eyJwYWxsZXQiOiJoYW5kbGVzIiwiZXh0cmluc2ljIjoiY2xhaW1IYW5kbGUifSwidHlwZSI6ImNsYWltSGFuZGxlIiwicGF5bG9hZCI6eyJiYXNlSGFuZGxlIjoiRXhhbXBsZUhhbmRsZSIsImV4cGlyYXRpb24iOjI0fX0seyJzaWduYXR1cmUiOnsiYWxnbyI6IlNSMjU1MTkiLCJlbmNvZGluZyI6ImJhc2UxNiIsImVuY29kZWRWYWx1ZSI6IjB4MDQwODRhZThjZWQ0ZTllMjdjYmMyN2JmMjVhM2MzNGNiNmZhZWVjNWZiZGNiMzMxMDIxZDk4ZGM0YTIxMWYxNzI1NmMwOGFhOTZkZWZjYjU5N2YzODY3YjA4YjNhOTAxZDYxYzhjZTM2ZTBmNGNjZGEwYmY3OTQ1OGFkMzk1ODAifSwiZW5kcG9pbnQiOnsicGFsbGV0IjoibXNhIiwiZXh0cmluc2ljIjoiYWRkUmVjb3ZlcnlDb21taXRtZW50In0sInR5cGUiOiJyZWNvdmVyeUNvbW1pdG1lbnQiLCJwYXlsb2FkIjp7InJlY292ZXJ5Q29tbWl0bWVudEhleCI6IjB4ZWVhMWUzOWQyZjE1NDU4NGM0YjFjYThmMjI4YmI0OWFlNWExNDc4NmVkNjNjOTAwMjVlNzU1ZjE2YmQ1OGQzNyIsImV4cGlyYXRpb24iOjIwfX1dLCJjcmVkZW50aWFscyI6W3siQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnL25zL2NyZWRlbnRpYWxzL3YyIiwiaHR0cHM6Ly93d3cudzMub3JnL25zL2NyZWRlbnRpYWxzL3VuZGVmaW5lZC10ZXJtcy92MiJdLCJ0eXBlIjpbIlZlcmlmaWVkRW1haWxBZGRyZXNzQ3JlZGVudGlhbCIsIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImlzc3VlciI6ImRpZDp3ZWI6ZnJlcXVlbmN5YWNjZXNzLmNvbSIsInZhbGlkRnJvbSI6IjIwMjQtMDgtMjFUMjE6Mjg6MDguMjg5KzAwMDAiLCJjcmVkZW50aWFsU2NoZW1hIjp7InR5cGUiOiJKc29uU2NoZW1hIiwiaWQiOiJodHRwczovL3NjaGVtYXMuZnJlcXVlbmN5YWNjZXNzLmNvbS9WZXJpZmllZEVtYWlsQWRkcmVzc0NyZWRlbnRpYWwvYmNpcWU0cW9jemhmdGljaTRkemZ2ZmJlbDdmbzRoNHNyNWdyY28zb292d3lrNnk0eW5mNDR0c2kuanNvbiJ9LCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDprZXk6ejZRTnVjUVY0QUYxWE1RVjRrbmdibW5CSHdZYTZtVnN3UEVHcmtGclVheWh0dFQxIiwiZW1haWxBZGRyZXNzIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJsYXN0VmVyaWZpZWQiOiIyMDI0LTA4LTIxVDIxOjI3OjU5LjMwOSswMDAwIn0sInByb29mIjp7InR5cGUiOiJEYXRhSW50ZWdyaXR5UHJvb2YiLCJ2ZXJpZmljYXRpb25NZXRob2QiOiJkaWQ6d2ViOmZyZXF1ZW5jeWFjY2Vzcy5jb20jejZNa29mV0V4V2tVdlRaZVhiOVRtTHRhNW1CVDZRdGo1OGVzNUZxZzFMNUJDV1FEIiwiY3J5cHRvc3VpdGUiOiJlZGRzYS1yZGZjLTIwMjIiLCJwcm9vZlB1cnBvc2UiOiJhc3NlcnRpb25NZXRob2QiLCJwcm9vZlZhbHVlIjoiejRqQXJuUHd1d1l4TG5iQmlyTGFucGtjeUJwbVF3bXluNWYzUGRUWW54aHB5NDhxcGd2SEhhdjZ3YXJqaXpqdnRMTWc2ajNGSzNCcWJSMm51eVQyVVRTV0MifX0seyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvdjIiLCJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvdW5kZWZpbmVkLXRlcm1zL3YyIl0sInR5cGUiOlsiVmVyaWZpZWRHcmFwaEtleUNyZWRlbnRpYWwiLCJWZXJpZmlhYmxlQ3JlZGVudGlhbCJdLCJpc3N1ZXIiOiJkaWQ6a2V5Ono2UU51Y1FWNEFGMVhNUVY0a25nYm1uQkh3WWE2bVZzd1BFR3JrRnJVYXlodHRUMSIsInZhbGlkRnJvbSI6IjIwMjQtMDgtMjFUMjE6Mjg6MDguMjg5KzAwMDAiLCJjcmVkZW50aWFsU2NoZW1hIjp7InR5cGUiOiJKc29uU2NoZW1hIiwiaWQiOiJodHRwczovL3NjaGVtYXMuZnJlcXVlbmN5YWNjZXNzLmNvbS9WZXJpZmllZEdyYXBoS2V5Q3JlZGVudGlhbC9iY2lxbWR2bXhkNTR6dmU1a2lmeWNnc2R0b2FoczVlY2Y0aGFsMnRzM2VleGtnb2N5YzVvY2EyeS5qc29uIn0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6NlFOdWNRVjRBRjFYTVFWNGtuZ2JtbkJId1lhNm1Wc3dQRUdya0ZyVWF5aHR0VDEiLCJlbmNvZGVkUHVibGljS2V5VmFsdWUiOiIweGI1MDMyOTAwMjkzZjFjOWU1ODIyZmQ5YzEyMGIyNTNjYjRhNGRmZTk0YzIxNGU2ODhlMDFmMzJkYjllZWRmMTciLCJlbmNvZGVkUHJpdmF0ZUtleVZhbHVlIjoiMHhkMDkxMGM4NTM1NjM3MjMyNTNjNGVkMTA1YzA4NjE0ZmM4YWFhZjFiMDg3MTM3NTUyMGQ3MjI1MTQ5NmU4ZDg3IiwiZW5jb2RpbmciOiJiYXNlMTYiLCJmb3JtYXQiOiJiYXJlIiwidHlwZSI6IlgyNTUxOSIsImtleVR5cGUiOiJkc25wLnB1YmxpYy1rZXkta2V5LWFncmVlbWVudCJ9fSx7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy9ucy9jcmVkZW50aWFscy92MiIsImh0dHBzOi8vd3d3LnczLm9yZy9ucy9jcmVkZW50aWFscy91bmRlZmluZWQtdGVybXMvdjIiXSwidHlwZSI6WyJWZXJpZmllZFJlY292ZXJ5U2VjcmV0Q3JlZGVudGlhbCIsIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImlzc3VlciI6ImRpZDprZXk6ejZRTnVjUVY0QUYxWE1RVjRrbmdibW5CSHdZYTZtVnN3UEVHcmtGclVheWh0dFQxIiwidmFsaWRGcm9tIjoiMjAyNC0wOC0yMVQyMToyODowOC4yODkrMDAwMCIsImNyZWRlbnRpYWxTY2hlbWEiOnsidHlwZSI6Ikpzb25TY2hlbWEiLCJpZCI6Imh0dHBzOi8vc2NoZW1hcy5mcmVxdWVuY3lhY2Nlc3MuY29tL1ZlcmlmaWVkUmVjb3ZlcnlTZWNyZXRDcmVkZW50aWFsL2JjaXFwZzZxbTRybnUyajR2NmdoeHFxZ3drZ2dva3d2eHMzdDJiZXhiZDNvYmt5cGtpcnl5bHhxLmpzb24ifSwiY3JlZGVudGlhbFN1YmplY3QiOnsiaWQiOiJkaWQ6a2V5Ono2UU51Y1FWNEFGMVhNUVY0a25nYm1uQkh3WWE2bVZzd1BFR3JrRnJVYXlodHRUMSIsInJlY292ZXJ5U2VjcmV0IjoiNjlFQy0yMzgyLUUxRTYtNzZGMy0zNDFGLTM0MTQtOURENS1DRkE1LTY5MzItRTQxOC05Mzg1LTAzNTgtMzFERi1BRkVBLTk4MjgtRDNCNyJ9fV19`;

    return {
      authorizationCode: mockAuthorizationCode,
      authorizationPayload: mockAuthorizationPayload
    };
  };

  const callAccountService = async (authorizationCode: string, authorizationPayload: string) => {
    // Mock the account service API call for demonstration
    console.log('📡 Making mock call to /v2/accounts/siwf with:', {
      authorizationCode,
      authorizationPayload: authorizationPayload.substring(0, 50) + '...'
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Return mock response matching WalletV2LoginResponseDto structure
    const mockResponse = {
      controlKey: "f6cL4wq1HUNx11TcvdABNf9UNXXoyH47mVUwT59tzSFRW8yDH",
      signUpReferenceId: "MjY3MjI3NWZlMGM0NTZmYjY3MWU0ZjQxN2ZiMmY5ODkyYzc1NzNiYQo",
      signUpStatus: "waiting",
      msaId: "314159265358979323846264338",
      email: credentials.email,
      phoneNumber: "555-867-5309",
      graphKey: "f6Y86vfvou3d4RGjYJM2k5L7g1HMjVTDMAtVMDh8g67i3VLZi",
      recoverySecret: "69EC-2382-E1E6-76F3-341F-3414-9DD5-CFA5-6932-E418-9385-0358-31DF-AFEA-9828-D3B7",
      rawCredentials: [
        {
          "@context": [
            "https://www.w3.org/ns/credentials/v2",
            "https://www.w3.org/ns/credentials/undefined-terms/v2"
          ],
          "type": [
            "VerifiedEmailAddressCredential",
            "VerifiableCredential"
          ],
          "issuer": "did:web:frequencyaccess.com",
          "validFrom": "2024-08-21T21:28:08.289+0000",
          "credentialSchema": {
            "type": "JsonSchema",
            "id": "https://schemas.frequencyaccess.com/VerifiedEmailAddressCredential/bciqe4qoczhftici4dzfvfbel7fo4h4sr5grco3oovwyk6y4ynf44tsi.json"
          },
          "credentialSubject": {
            "id": "did:key:z6QNucQV4AF1XMQV4kngbmnBHwYa6mVswPEGrkFrUayhttT1",
            "emailAddress": credentials.email,
            "lastVerified": "2024-08-21T21:27:59.309+0000"
          },
          "proof": {
            "type": "DataIntegrityProof",
            "verificationMethod": "did:web:frequencyaccess.com#z6MkofWExWkUvTZeXb9TmLta5mBT6Qtj58es5Fqg1L5BCWQD",
            "cryptosuite": "eddsa-rdfc-2022",
            "proofPurpose": "assertionMethod",
            "proofValue": "z4jArnPwuwYxLnbBirLanpkcyBpmQwmyn5f3PdTYnxhpy48qpgvHHav6warjizjvtLMg6j3FK3BqbR2nuyT2UTSWC"
          }
        },
        {
          "@context": [
            "https://www.w3.org/ns/credentials/v2",
            "https://www.w3.org/ns/credentials/undefined-terms/v2"
          ],
          "type": [
            "VerifiedGraphKeyCredential",
            "VerifiableCredential"
          ],
          "issuer": "did:key:z6QNucQV4AF1XMQV4kngbmnBHwYa6mVswPEGrkFrUayhttT1",
          "validFrom": "2024-08-21T21:28:08.289+0000",
          "credentialSchema": {
            "type": "JsonSchema",
            "id": "https://schemas.frequencyaccess.com/VerifiedGraphKeyCredential/bciqmdvmxd54zve5kifycgsdtoahs5ecf4hal2ts3eexkgocyc5oca2y.json"
          },
          "credentialSubject": {
            "id": "did:key:z6QNucQV4AF1XMQV4kngbmnBHwYa6mVswPEGrkFrUayhttT1",
            "encodedPublicKeyValue": "0xb5032900293f1c9e5822fd9c120b253cb4a4dfe94c214e688e01f32db9eedf17",
            "encodedPrivateKeyValue": "0xd0910c853563723253c4ed105c08614fc8aaaf1b0871375520d72251496e8d87",
            "encoding": "base16",
            "format": "bare",
            "type": "X25519",
            "keyType": "dsnp.public-key-key-agreement"
          },
          "proof": {
            "type": "DataIntegrityProof",
            "verificationMethod": "did:key:z6MktZ15TNtrJCW2gDLFjtjmxEdhCadNCaDizWABYfneMqhA",
            "cryptosuite": "eddsa-rdfc-2022",
            "proofPurpose": "assertionMethod",
            "proofValue": "z2HHWwtWggZfvGqNUk4S5AAbDGqZRFXjpMYAsXXmEksGxTk4DnnkN3upCiL1mhgwHNLkxY3s8YqNyYnmpuvUke7jF"
          }
        }
      ]
    };

    console.log('✅ Mock account service response:', mockResponse);
    return mockResponse;
  };

  const handleAuthenticate = async () => {
    if (!credentials.email || !credentials.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (authMode === 'signup' && !credentials.handle) {
      toast.error('Handle is required for signup');
      return;
    }

    setIsLoading(true);

    try {
      console.log(`🔐 Mock ${authMode} authentication for:`, credentials.email);
      
      // Generate mock authorization data
      const mockAuthData = generateMockAuthData(credentials.email, credentials.handle);
      
      console.log('🔗 Generated mock auth data:', mockAuthData);
      
      // Call the account service API
      console.log('📡 Calling account service API...');
      const accountResponse = await callAccountService(
        mockAuthData.authorizationCode,
        mockAuthData.authorizationPayload
      );
      
      console.log('✅ Account service response:', accountResponse);
      
      toast.success(`${authMode === 'login' ? 'Login' : 'Signup'} successful!`);
      
      // Pass the result back to parent
      onSuccess({
        authMode,
        credentials,
        mockAuthData,
        accountResponse
      });
      
    } catch (error: any) {
      console.error(`❌ Mock ${authMode} failed:`, error);
      toast.error(error.message || `${authMode} failed`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderChooseMode = () => (
    <div className="mock-auth-choose">
      <div className="auth-header">
        <h2>🎭 Mock Frequency Access</h2>
        <p>Choose how you want to authenticate</p>
      </div>
      
      <div className="auth-buttons">
        <button
          onClick={() => handleModeSelect('login')}
          className="frequency-btn frequency-btn-primary frequency-btn-large"
        >
          <User className="icon" />
          Login with Existing Account
        </button>
        
        <button
          onClick={() => handleModeSelect('signup')}
          className="frequency-btn frequency-btn-secondary frequency-btn-large"
        >
          <Key className="icon" />
          Sign Up New Account
        </button>
      </div>
      
      <div className="auth-note">
        <p>
          <strong>Note:</strong> This is a mock authentication interface that bypasses Frequency Access.
          It will generate the same mock authorizationCode and authorizationPayload for demonstration purposes.
        </p>
      </div>
    </div>
  );

  const renderAuthForm = () => (
    <div className="mock-auth-form">
      <div className="auth-header">
        <button 
          onClick={() => setAuthMode('choose')}
          className="frequency-btn frequency-btn-ghost"
        >
          <ArrowLeft className="icon" />
          Back
        </button>
        <h2>
          {authMode === 'login' ? '🔑 Login' : '🆕 Sign Up'}
        </h2>
        <p>
          {authMode === 'login' 
            ? 'Enter your existing account credentials'
            : 'Create a new Frequency account'
          }
        </p>
      </div>

      <div className="auth-form">
        <div className="form-group">
          <label htmlFor="email">
            <Mail className="icon" />
            Email Address <span className="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            placeholder="user@example.com"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            <Lock className="icon" />
            Password <span className="required">*</span>
          </label>
          <input
            id="password"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            placeholder="Enter your password"
            className="form-input"
            required
          />
        </div>

        {authMode === 'signup' && (
          <div className="form-group">
            <label htmlFor="handle">
              <User className="icon" />
              Handle <span className="required">*</span>
            </label>
            <input
              id="handle"
              type="text"
              value={credentials.handle}
              onChange={(e) => setCredentials({...credentials, handle: e.target.value})}
              placeholder="cooluser"
              className="form-input"
              required
            />
          </div>
        )}

        <button
          onClick={handleAuthenticate}
          disabled={isLoading}
          className="frequency-btn frequency-btn-primary frequency-btn-large"
        >
          {isLoading ? (
            <>
              <Loader className="icon frequency-animate-spin" />
              Authenticating...
            </>
          ) : (
            <>
              <CheckCircle className="icon" />
              Authenticate
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="mock-authenticator">
      <div className="frequency-card">
        <div className="frequency-card-content">
          {authMode === 'choose' && renderChooseMode()}
          {(authMode === 'login' || authMode === 'signup') && renderAuthForm()}
          
          <div className="auth-footer">
            <button
              onClick={onCancel}
              className="frequency-btn frequency-btn-ghost"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 