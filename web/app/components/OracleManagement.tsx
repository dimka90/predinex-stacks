"use client";

import { StacksClient } from 'predinex-stacks-sdk';
import { CONTRACT_ADDRESS, CONTRACT_NAME, DEFAULT_NETWORK } from '../lib/constants'; // Adjusting based on grep later

// types already defined above in interfaces
id: number;
address: string;
reliabilityScore: number;
totalResolutions: number;
successfulResolutions: number;
isActive: boolean;
dataTypes: string[];
}

interface OracleSubmission {
  id: number;
  providerId: number;
  poolId: number;
  dataValue: string;
  dataType: string;
  confidence: number;
  timestamp: number;
}

export default function OracleManagement() {
  const [oracleProviders, setOracleProviders] = useState<OracleProvider[]>([]);
  const [oracleSubmissions, setOracleSubmissions] = useState<OracleSubmission[]>([]);
  const [selectedTab, setSelectedTab] = useState<'providers' | 'submissions' | 'register'>('providers');
  const [isLoading, setIsLoading] = useState(false);

  const [contractConfig] = useState({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    network: DEFAULT_NETWORK === 'mainnet' ? 'mainnet' : 'testnet'
  });

  useEffect(() => {
    const fetchOracleData = async () => {
      setIsLoading(true);
      try {
        const client = new StacksClient({
          network: contractConfig.network as any,
          contractAddress: contractConfig.contractAddress,
          contractName: contractConfig.contractName
        });

        // Fetch multiple providers (up to 5 for now)
        const providerPromises = [0, 1, 2].map(id => client.getOracleProvider(id));
        const providers = await Promise.all(providerPromises);

        const validProviders = providers
          .filter(p => p !== null)
          .map(p => ({
            id: p!.id,
            address: p!.address,
            reliabilityScore: p!.reputationScore,
            totalResolutions: p!.totalSubmissions,
            successfulResolutions: p!.successfulSubmissions,
            isActive: p!.isActive && !p!.isBanned,
            dataTypes: ['aggregated'] // This specific info might need more contract calls
          }));

        setOracleProviders(validProviders);

        // Fetch latest aggregations for some sample pools
        const submissionPromises = [1, 2, 3].map(id => client.getLatestAggregation(id));
        const submissions = await Promise.all(submissionPromises);

        const validSubmissions = submissions
          .filter(s => s !== null)
          .map((s, idx) => ({
            id: idx,
            providerId: s!.providerId,
            poolId: s!.poolId,
            dataValue: s!.value,
            dataType: 'aggregated',
            confidence: s!.confidence,
            timestamp: s!.timestamp
          }));

        setOracleSubmissions(validSubmissions);
      } catch (error) {
        console.error("Error fetching oracle data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOracleData();
  }, [contractConfig]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  const renderProviders = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Oracle Providers</h3>
        <div className="text-sm text-muted-foreground">
          {oracleProviders.filter(p => p.isActive).length} active providers
        </div>
      </div>

      <div className="grid gap-4">
        {oracleProviders.map((provider) => (
          <div key={provider.id} className="glass p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-sm">#{provider.id}</span>
                  <span className={`px-2 py-1 rounded text-xs ${provider.isActive
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-red-500/10 text-red-500'
                    }`}>
                    {provider.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="font-mono text-sm text-muted-foreground">
                  {formatAddress(provider.address)}
                </div>
              </div>

              <div className="text-right">
                <div className={`text-2xl font-bold ${getReliabilityColor(provider.reliabilityScore)}`}>
                  {provider.reliabilityScore}%
                </div>
                <div className="text-xs text-muted-foreground">Reliability</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-muted-foreground">Total Resolutions</div>
                <div className="font-semibold">{provider.totalResolutions}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Successful</div>
                <div className="font-semibold text-green-500">{provider.successfulResolutions}</div>
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">Supported Data Types</div>
              <div className="flex flex-wrap gap-2">
                {provider.dataTypes.map((type) => (
                  <span key={type} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSubmissions = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Recent Oracle Submissions</h3>
        <div className="text-sm text-muted-foreground">
          {oracleSubmissions.length} submissions
        </div>
      </div>

      <div className="space-y-3">
        {oracleSubmissions.map((submission) => {
          const provider = oracleProviders.find(p => p.id === submission.providerId);
          return (
            <div key={submission.id} className="glass p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm">#{submission.id}</span>
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs">
                      {submission.dataType}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Pool #{submission.poolId}
                    </span>
                  </div>

                  <div className="text-lg font-semibold mb-1">
                    {submission.dataValue}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    by {provider ? formatAddress(provider.address) : 'Unknown'}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-green-500">
                    {submission.confidence}% confidence
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTimestamp(submission.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Register New Oracle Provider</h3>

      <div className="glass p-6 rounded-xl">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Oracle Provider Address
            </label>
            <input
              type="text"
              placeholder="SP1HTBVD3JG9C05J7HBJTHGR0GGW7KX975CN0QKA"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Supported Data Types
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['price', 'volume', 'weather', 'sports', 'temperature', 'market-cap'].map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Registering...' : 'Register Oracle Provider'}
          </button>
        </form>
      </div>

      <div className="glass p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Requirements</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Valid Stacks address</li>
          <li>• At least one supported data type</li>
          <li>• Only admins can register new providers</li>
          <li>• Providers start with 100% reliability score</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Oracle Management</h1>
        <p className="text-muted-foreground">
          Manage oracle providers and monitor data submissions for automated market resolution
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
        {[
          { key: 'providers', label: 'Providers' },
          { key: 'submissions', label: 'Submissions' },
          { key: 'register', label: 'Register' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key as any)}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${selectedTab === tab.key
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {selectedTab === 'providers' && renderProviders()}
        {selectedTab === 'submissions' && renderSubmissions()}
        {selectedTab === 'register' && renderRegister()}
      </div>
    </div>
  );
}