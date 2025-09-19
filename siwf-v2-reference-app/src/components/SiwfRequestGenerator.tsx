import React, { useState } from 'react';
import { Settings, Copy, ExternalLink, ChevronDown, ChevronUp, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateSiwfSignedRequest, type SiwfRequestOptions, type SiwfGeneratedRequest } from '../utils/siwf';
import type { WalletType } from '../types';

// SIWF Permission definitions
const PERMISSION_BUNDLES = {
  'public-private-graph': {
    name: 'Bundle: Public & Private Graph',
    permissions: [6, 7, 8, 9, 10],
    description: 'Manage both public and private social connections'
  },
  'dsnp-v13-content': {
    name: 'Bundle: DSNP v1.3 Content',
    permissions: [1, 2, 3, 4, 5],
    description: 'Legacy content management (Deprecated)'
  }
};

const INDIVIDUAL_PERMISSIONS = [
  { id: 1, name: 'dsnp.broadcast: Create new public content (v1)', deprecated: true },
  { id: 2, name: 'dsnp.profile: Update profile information (v1)', deprecated: true },
  { id: 3, name: 'dsnp.reply: Public reply to content (v1)', deprecated: true },
  { id: 4, name: 'dsnp.tombstone: Mark content for deletion (v1)', deprecated: true },
  { id: 5, name: 'dsnp.update: Update an existing post or reply (v1)' },
  { id: 6, name: 'dsnp.broadcast: Create new public content (v2)' },
  { id: 7, name: 'dsnp.dsnp-content-attribute: Create an authenticated attribute set for DSNP content (v1)' },
  { id: 8, name: 'dsnp.ext-content-attribute: Create an authenticated attribute set for content external to DSNP (v1)' },
  { id: 9, name: 'dsnp.private-connections: Update private friendship connections (v1)' },
  { id: 10, name: 'dsnp.private-follows: Update private follow list (v1)' },
  { id: 11, name: 'dsnp.profile-resources: Update user profile information (v1)' },
  { id: 12, name: 'dsnp.public-follows: Update public follow list (v1)' },
  { id: 13, name: 'dsnp.reaction: Public reaction to content (v1)' },
  { id: 14, name: 'dsnp.reply: Public reply to content (v2)' },
  { id: 15, name: 'dsnp.tombstone: Mark content for deletion (v2)' },
  { id: 16, name: 'dsnp.update: Update an existing post or reply (v2)' },
  { id: 17, name: 'dsnp.user-attribute-set: Create an authenticated attribute set for a DSNP User (v2)' }
];

interface SiwfRequestGeneratorProps {
  onStartAuthentication: (signedRequest: string) => void;
  walletInfo?: {
    account: string;
    walletType: WalletType;
  };
  signSiwfRequest?: (payload: string) => Promise<string>;
  getPolkadotPublicKey?: () => Promise<string>;
}

export const SiwfRequestGenerator: React.FC<SiwfRequestGeneratorProps> = ({ 
  onStartAuthentication,
  walletInfo,
  signSiwfRequest,
  getPolkadotPublicKey
}) => {
  // Form state
  const [callbackUri, setCallbackUri] = useState('http://localhost:5173/login/callback');
  const [selectedBundle, setSelectedBundle] = useState('public-private-graph');
  const [customPermissions, setCustomPermissions] = useState<number[]>([]);
  const [additionalPermissions, setAdditionalPermissions] = useState('');
  const [schemaIds, setSchemaIds] = useState('');
  const [credentials, setCredentials] = useState({
    graphKey: true,
    recoverySecret: false,
    email: true,
    phone: true
  });
  const [applicationContextUrl, setApplicationContextUrl] = useState('');

  // Result state
  const [generatedRequest, setGeneratedRequest] = useState<SiwfGeneratedRequest | null>(null);
  const [showJson, setShowJson] = useState(false);

  const generateSignedRequest = async () => {
    try {
      // Get permissions from bundle or custom selection
      let permissions: number[] = [];
      if (selectedBundle && PERMISSION_BUNDLES[selectedBundle as keyof typeof PERMISSION_BUNDLES]) {
        permissions = PERMISSION_BUNDLES[selectedBundle as keyof typeof PERMISSION_BUNDLES].permissions;
      } else {
        permissions = customPermissions;
      }

      // Add additional permissions
      if (additionalPermissions.trim()) {
        const additional = additionalPermissions.split(',').map(p => parseInt(p.trim())).filter(n => !isNaN(n));
        permissions = [...new Set([...permissions, ...additional])];
      }

      // Build the request options
      const options: SiwfRequestOptions = {
        callbackUri,
        permissions,
        additionalPermissions,
        schemaIds: schemaIds ? schemaIds.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)) : [],
        credentials,
        applicationContextUrl: applicationContextUrl || undefined
      };

      // Generate the signed request with real signing functions
      const result = await generateSiwfSignedRequest(options, walletInfo, signSiwfRequest, getPolkadotPublicKey);
      setGeneratedRequest(result);

      toast.success('Signed request generated successfully!');
    } catch (error) {
      console.error('Error generating signed request:', error);
      toast.error('Failed to generate signed request');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const startAuthentication = () => {
    if (generatedRequest) {
      onStartAuthentication(generatedRequest.signedRequest);
    }
  };

  return (
    <div className="siwf-generator">
      <div className="frequency-card">
        <div className="frequency-card-header">
          <h2 className="card-title">
            <Settings className="icon" />
            <span className="responsive-hide-phone">SIWF Request Generator</span>
            <span className="responsive-show-phone">Request Generator</span>
          </h2>
          <p className="card-description">
            <span className="responsive-hide-phone">Generate a signed request for SIWF authentication</span>
            <span className="responsive-show-phone">Generate SIWF request</span>
          </p>
        </div>

        <div className="frequency-card-content">
          <div className="form-section">
            {/* Wallet Status */}
            {walletInfo ? (
              <div className="form-group">
                <div className="wallet-status connected">
                  ✅ <strong>Using Connected Wallet:</strong> {walletInfo.walletType === 'metamask' ? '🦊 MetaMask' : '🔴 Polkadot.js'} ({walletInfo.account.slice(0, 8)}...{walletInfo.account.slice(-6)})
                </div>
              </div>
            ) : (
              <div className="form-group">
                <div className="wallet-status not-connected">
                  ⚠️ <strong>No Wallet Connected:</strong> Using mock public key for demonstration
                </div>
              </div>
            )}

            {/* Callback URI */}
            <div className="form-group">
              <label htmlFor="callbackUri">
                Callback URI <span className="required">*</span>
              </label>
              <input
                id="callbackUri"
                type="url"
                value={callbackUri}
                onChange={(e) => setCallbackUri(e.target.value)}
                placeholder="http://localhost:5173/login/callback"
                className="form-input"
                required
              />
            </div>

            {/* Permissions */}
            <div className="form-group">
              <label>Permissions</label>
              <div className="permission-bundles">
                <div className="bundle-option">
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="permissionType"
                      value="public-private-graph"
                      checked={selectedBundle === 'public-private-graph'}
                      onChange={(e) => setSelectedBundle(e.target.value)}
                    />
                    Bundle: Public & Private Graph
                    <span className="info-icon" title="Manage both public and private social connections">ⓘ</span>
                  </label>
                </div>
                <div className="bundle-option">
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="permissionType"
                      value="dsnp-v13-content"
                      checked={selectedBundle === 'dsnp-v13-content'}
                      onChange={(e) => setSelectedBundle(e.target.value)}
                    />
                    Bundle: DSNP v1.3 Content
                    <span className="info-icon" title="Legacy content management (Deprecated)">ⓘ</span>
                    <span className="deprecated">(Deprecated)</span>
                  </label>
                </div>
                <div className="bundle-option">
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="permissionType"
                      value="custom"
                      checked={selectedBundle === 'custom'}
                      onChange={(e) => setSelectedBundle(e.target.value)}
                    />
                    Custom Selection
                  </label>
                </div>
              </div>

              {selectedBundle === 'custom' && (
                <div className="individual-permissions">
                  {INDIVIDUAL_PERMISSIONS.map(permission => (
                    <div key={permission.id} className="permission-item">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={customPermissions.includes(permission.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCustomPermissions([...customPermissions, permission.id]);
                            } else {
                              setCustomPermissions(customPermissions.filter(id => id !== permission.id));
                            }
                          }}
                        />
                        {permission.name}
                        {permission.deprecated && <span className="deprecated">(Deprecated)</span>}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Permissions */}
            <div className="form-group">
              <label htmlFor="additionalPermissions">
                Additional Permissions (comma-separated)
              </label>
              <input
                id="additionalPermissions"
                type="text"
                value={additionalPermissions}
                onChange={(e) => setAdditionalPermissions(e.target.value)}
                placeholder="18, 19, 20"
                className="form-input"
              />
            </div>

            {/* Schema IDs */}
            <div className="form-group">
              <label htmlFor="schemaIds">
                Read Only: List of Schema Ids
              </label>
              <input
                id="schemaIds"
                type="text"
                value={schemaIds}
                onChange={(e) => setSchemaIds(e.target.value)}
                placeholder="1, 2, 3"
                className="form-input"
              />
            </div>

            {/* Credentials */}
            <div className="form-group">
              <label>Select Credentials</label>
              <div className="credentials-grid">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={credentials.graphKey}
                    onChange={(e) => setCredentials({...credentials, graphKey: e.target.checked})}
                  />
                  Graph Key (Required for reading private graph)
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={credentials.recoverySecret}
                    onChange={(e) => setCredentials({...credentials, recoverySecret: e.target.checked})}
                  />
                  Recovery Secret for account
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={credentials.email}
                    onChange={(e) => setCredentials({...credentials, email: e.target.checked})}
                  />
                  Verified Email Address
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={credentials.phone}
                    onChange={(e) => setCredentials({...credentials, phone: e.target.checked})}
                  />
                  Verified SMS/Phone Number
                </label>
              </div>
            </div>

            {/* Application Context URL */}
            <div className="form-group">
              <label htmlFor="applicationContextUrl">
                Application Context URL
              </label>
              <input
                id="applicationContextUrl"
                type="url"
                value={applicationContextUrl}
                onChange={(e) => setApplicationContextUrl(e.target.value)}
                placeholder="https://example.org/myapp/siwf-manifest.json"
                className="form-input"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generateSignedRequest}
              className="btn btn-primary btn-large"
            >
              <Key className="icon" />
              Generate Signed Request
            </button>
          </div>

          {/* Results Section */}
          {generatedRequest && (
            <div className="results-section">
              <h3>Result</h3>
              
              <div className="result-group">
                <h4>Login Request Payload and Signature (<code>signedRequest</code> parameter)</h4>
                <div className="result-field">
                  <input
                    type="text"
                    value={generatedRequest.signedRequest}
                    readOnly
                    className="form-input"
                  />
                  <button
                    onClick={() => copyToClipboard(generatedRequest.signedRequest)}
                    className="btn btn-secondary btn-small"
                  >
                    <Copy className="icon" />
                  </button>
                </div>
              </div>

              <div className="result-group">
                <h4>Mainnet/Production URL</h4>
                <div className="result-field">
                  <input
                    type="text"
                    value={generatedRequest.mainnetUrl}
                    readOnly
                    className="form-input"
                  />
                  <button
                    onClick={() => copyToClipboard(generatedRequest.mainnetUrl)}
                    className="btn btn-secondary btn-small"
                  >
                    <Copy className="icon" />
                  </button>
                  <a
                    href={generatedRequest.mainnetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-small"
                  >
                    <ExternalLink className="icon" />
                  </a>
                </div>
              </div>

              <div className="result-group">
                <h4>Testnet/Staging URL</h4>
                <div className="result-field">
                  <input
                    type="text"
                    value={generatedRequest.testnetUrl}
                    readOnly
                    className="form-input"
                  />
                  <button
                    onClick={() => copyToClipboard(generatedRequest.testnetUrl)}
                    className="btn btn-secondary btn-small"
                  >
                    <Copy className="icon" />
                  </button>
                  <a
                    href={generatedRequest.testnetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-small"
                  >
                    <ExternalLink className="icon" />
                  </a>
                </div>
              </div>

              <div className="result-group">
                <div className="expandable-section">
                  <button
                    onClick={() => setShowJson(!showJson)}
                    className="btn btn-ghost"
                  >
                    Signed Request (JSON)
                    {showJson ? <ChevronUp className="icon" /> : <ChevronDown className="icon" />}
                  </button>
                  {showJson && (
                    <pre className="json-display">
                      {JSON.stringify(generatedRequest.jsonPayload, null, 2)}
                    </pre>
                  )}
                </div>
              </div>

              {/* Start Authentication Button */}
              <button
                onClick={startAuthentication}
                className="btn btn-primary btn-large"
                style={{ marginTop: '1rem' }}
              >
                Start SIWF Authentication
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 