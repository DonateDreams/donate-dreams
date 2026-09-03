import React, {
  useMemo,
  useState,
} from 'react';


const wallets = {
  ethereum: {
    network: 'Ethereum',
    asset: 'ETH',
    symbol: 'ETH',
    address:
      '0x41B69E79E696A5398eBD9601bb37a1AE6eeb9710',
    warning:
      'Only send ETH on the Ethereum network to this address.',
  },

  bitcoin: {
    network: 'Bitcoin',
    asset: 'BTC',
    symbol: 'BTC',
    address:
      'bc1qje57txxclsy67q5ck50kxrlz053uwqsl6lmhd8',
    warning:
      'Only send BTC on the Bitcoin network to this address.',
  },

  solana: {
    network: 'Solana',
    asset: 'SOL',
    symbol: 'SOL',
    address:
      '6ZfQUW6odFCoy3M9VpuofezA2jV7x5W5Sdz53isJGxcZ',
    warning:
      'Only send SOL on the Solana network to this address.',
  },

  base: {
    network: 'Base',
    asset: 'ETH',
    symbol: 'ETH',
    address:
      '0x41B69E79E696A5398eBD9601bb37a1AE6eeb9710',
    warning:
      'Only send ETH on the Base network to this address.',
  },

  polygon: {
    network: 'Polygon',
    asset: 'POL',
    symbol: 'POL',
    address:
      '0x41B69E79E696A5398eBD9601bb37a1AE6eeb9710',
    warning:
      'Only send POL on the Polygon network to this address.',
  },

  tron: {
    network: 'TRON',
    asset: 'TRX',
    symbol: 'TRX',
    address:
      'THmjfgzc9AZYSPRMafw27Hfve17oAyjWsi',
    warning:
      'Only send TRX on the TRON network to this address.',
  },
};


const SupportDonateDreams = () => {

  const [
    selectedNetwork,
    setSelectedNetwork,
  ] = useState('ethereum');


  const [
    copied,
    setCopied,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState('');


  const wallet =
    wallets[selectedNetwork];


  const shortAddress =
    useMemo(() => {

      if (!wallet?.address) {
        return '';
      }

      return (
        `${wallet.address.slice(0, 12)}...` +
        `${wallet.address.slice(-10)}`
      );

    }, [
      wallet,
    ]);


  const copyAddress = async () => {

    setCopied(false);
    setError('');


    try {

      await navigator.clipboard.writeText(
        wallet.address
      );


      setCopied(true);


      setTimeout(() => {
        setCopied(false);
      }, 2200);

    } catch {

      setError(
        'Unable to copy the address. Please copy it manually.'
      );

    }

  };


  const handleNetworkChange = (
    event
  ) => {

    setSelectedNetwork(
      event.target.value
    );

    setCopied(false);
    setError('');

  };


  return (
    <div className="page">

      {/* =================================
          HEADER
      ================================= */}

      <section className="account-header">

        <div>

          <span className="section-kicker">
            SUPPORT DONATE DREAMS
          </span>

          <h1>
            Help keep Donate Dreams alive.
          </h1>

          <p>
            If Donate Dreams has helped you,
            inspired you, or you simply believe
            in the idea, you can support the
            website directly.
          </p>

        </div>

      </section>


      {/* =================================
          SUPPORT CARD
      ================================= */}

      <div
        className="dream-form-card"
        style={{
          maxWidth: '760px',
          margin: '0 auto',
        }}
      >

        <div
          style={{
            marginBottom: '28px',
          }}
        >

          <span className="section-kicker">
            CHOOSE A NETWORK
          </span>

          <h2>
            Select your crypto network.
          </h2>

          <p>
            Choose the exact network and asset
            you intend to send before copying
            the receiving address.
          </p>

        </div>


        {/* =================================
            NETWORK SELECT
        ================================= */}

        <div
          className="donation-section"
        >

          <label
            className="donation-field"
          >

            <span>
              Network & asset
            </span>

            <select
              value={selectedNetwork}
              onChange={
                handleNetworkChange
              }
            >

              <option value="ethereum">
                Ethereum — ETH
              </option>

              <option value="base">
                Base — ETH
              </option>

              <option value="polygon">
                Polygon — POL
              </option>

              <option value="bitcoin">
                Bitcoin — BTC
              </option>

              <option value="solana">
                Solana — SOL
              </option>

              <option value="tron">
                TRON — TRX
              </option>

            </select>

          </label>

        </div>


        {/* =================================
            SELECTED NETWORK
        ================================= */}

        <div
          className="donation-wallet-box"
          style={{
            marginTop: '24px',
          }}
        >

          <div
            className="donation-wallet-content"
          >

            <span className="section-kicker">
              RECEIVING ADDRESS
            </span>

            <strong
              style={{
                display: 'block',
                fontSize: '1.15rem',
                marginTop: '8px',
              }}
            >
              {wallet.network}
              {' — '}
              {wallet.asset}
            </strong>

            <div
              className="donation-wallet"
              style={{
                wordBreak: 'break-all',
                marginTop: '10px',
              }}
            >
              {wallet.address}
            </div>

          </div>


          <button
            type="button"
            className="glass-button secondary donation-copy-button"
            onClick={copyAddress}
          >
            {copied
              ? 'Copied ✓'
              : 'Copy Address'}
          </button>

        </div>


        {/* =================================
            ADDRESS SUMMARY
        ================================= */}

        <div
          style={{
            marginTop: '20px',
            padding: '18px',
            borderRadius: '18px',
            background:
              'rgba(255, 255, 255, 0.04)',
            border:
              '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >

            <div>

              <span className="section-kicker">
                NETWORK
              </span>

              <strong
                style={{
                  display: 'block',
                  marginTop: '6px',
                }}
              >
                {wallet.network}
              </strong>

            </div>


            <div>

              <span className="section-kicker">
                ASSET
              </span>

              <strong
                style={{
                  display: 'block',
                  marginTop: '6px',
                }}
              >
                {wallet.symbol}
              </strong>

            </div>


            <div>

              <span className="section-kicker">
                ADDRESS
              </span>

              <strong
                style={{
                  display: 'block',
                  marginTop: '6px',
                }}
              >
                {shortAddress}
              </strong>

            </div>

          </div>

        </div>


        {/* =================================
            WARNING
        ================================= */}

        <div
          className="donation-warning"
          style={{
            marginTop: '24px',
          }}
        >

          <strong>
            ⚠️ Verify before sending
          </strong>

          <br />

          {wallet.warning}

          <br />

          <br />

          Blockchain transactions are generally
          irreversible. Always verify the
          network, asset, and complete address
          in your wallet before confirming.

        </div>


        {/* =================================
            COPY BUTTON
        ================================= */}

        <div
          style={{
            marginTop: '24px',
          }}
        >

          <button
            type="button"
            className="glass-button primary full-width"
            onClick={copyAddress}
          >

            {copied
              ? 'Address Copied ✓'
              : `Copy ${wallet.network} Address`}

            {!copied && (
              <span>
                →
              </span>
            )}

          </button>

        </div>


        {/* =================================
            ERROR
        ================================= */}

        {error && (

          <div
            className="error-box donation-error"
            style={{
              marginTop: '18px',
            }}
          >
            {error}
          </div>

        )}


        {/* =================================
            MANUAL SEND
        ================================= */}

        <div
          className="donation-divider"
          style={{
            marginTop: '32px',
          }}
        >
          <span>
            HOW IT WORKS
          </span>
        </div>


        <div
          style={{
            display: 'grid',
            gap: '14px',
            marginTop: '20px',
          }}
        >

          <div>
            <strong>
              01 — Choose your network
            </strong>

            <p>
              Select the network and asset you
              want to use from the menu above.
            </p>
          </div>


          <div>
            <strong>
              02 — Copy the address
            </strong>

            <p>
              Copy the receiving address and
              paste it into your crypto wallet.
            </p>
          </div>


          <div>
            <strong>
              03 — Verify everything
            </strong>

            <p>
              Confirm the network, asset,
              destination address, and amount
              inside your wallet.
            </p>
          </div>


          <div>
            <strong>
              04 — Send
            </strong>

            <p>
              Complete the transaction directly
              from your wallet.
            </p>
          </div>

        </div>


        {/* =================================
            FINAL MESSAGE
        ================================= */}

        <div
          style={{
            marginTop: '32px',
            textAlign: 'center',
          }}
        >

          <span className="section-kicker">
            THANK YOU
          </span>

          <h3>
            Every bit of support helps.
          </h3>

          <p>
            Donate Dreams does not require
            support to use the platform.
            Contributions simply help support
            the continued development,
            hosting, and future of the project.
          </p>

        </div>

      </div>

    </div>
  );
};


export default SupportDonateDreams;

