import "../styles/WithdrawAave.css"
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import ShowQRCode from "./ShowQRCode"
import Warning from "./Warning"

function WithdrawAave({ myPrivateKey, isInitialized, chain, api, blockExplorer, myWallet }) {

    const [recipient, setRecipient] = useState('')
    const [decimals, setDecimals] = useState('')
    const [token, setToken] = useState('')
    const [amount, setAmount] = useState('')
    const [gasPrice, setGasPrice] = useState('')
    const [nonce, setNonce] = useState('')
    const [text, setText] = useState('')
    const [visible, setVisible] = useState(false)
    const [txToAccept, setTxToAccept] = useState('')
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false)


    const handleRecipientChange = event => {
        setRecipient(event.target.value.replace(/\s/g, ''))
    }
    const handleDecimalsChange = event => {
        setDecimals(event.target.value.replace(/\s/g, ''))
    }
    const handleTokenChange = event => {
        setToken(event.target.value.replace(/\s/g, ''))
    }
    const handleAmountChange = event => { 
        setAmount(event.target.value.replace(/\s/g, ''))
    }
    const handleGasPriceChange = event => {
        setGasPrice(event.target.value.replace(/\s/g, ''))
    }
    const handleNonceChange = event => {
        setNonce(event.target.value.replace(/\s/g, ''))
    }

    const handleSubmit = event => {
        event.preventDefault();

        // Check input format
        if (!ethers.utils.isAddress(recipient) || !ethers.utils.isAddress(token) || !(parseFloat(amount) > 0)) {
            alert('Invalid input format.')
        } else {
            const formData = {
                recipient, 
                decimals,
                token,
                amount,
                gasPrice,
                nonce
            }
            processSubmittedDataFunction(formData);
            setRecipient('')
            setDecimals('')
            setToken('')
            setAmount('')
            setGasPrice('')
            setNonce('')  
        }
    }
    
    async function processSubmittedDataFunction(formData) {
        
        const txtAmount = (amount*10**(parseInt(formData.decimals))).toString(16).padStart(64, 0)
        const txtWallet = myWallet.substring(2).padStart(64, 0)
        const txtToken = formData.token.substring(2).padStart(64, 0)

        if (txtAmount.length === 64 && isFinite(amount*10**(parseInt(formData.decimals)))) {
            const unsigned_tx = {
                chainId: parseInt(chain),
                to: formData.recipient,
                value: ethers.utils.parseEther("0"),
                gasPrice: formData.gasPrice*1e9,
                gasLimit: 500000,
                nonce: parseInt(formData.nonce),
                data: "0x69328dec" + txtToken + txtAmount + txtWallet
            }
            
            setTxToAccept(unsigned_tx)

        } else {
            alert("Amount: overflow")
        }

    }

    useEffect(() => {
        text.length > 0 ? setVisible(true) : setVisible(false)
      }, [text]);

    return (isInitialized && parseInt(chain) === 1) ? (
    <div>
        <div className="evm-withdraw-aave evm-columns">
            <div className="evm-columns adapt">
            <p>Withdraw tokens on app.aave.com.</p>

            </div>
            <form className="evm-columns" onSubmit={handleSubmit}>
                <label>
                    <input 
                    type="text" 
                    name="recipient"
                    value={recipient}
                    placeholder="AAVE protocol (To)"
                    onChange={handleRecipientChange}
                    />
                </label> <br></br>
                <label>
                    <input 
                    type="text" 
                    name="decimals"
                    value={decimals}
                    placeholder="Token decimals"
                    onChange={handleDecimalsChange}
                    />
                </label> <br></br>
                <label>
                    <input 
                    type="text" 
                    name="token"
                    value={token}
                    placeholder="Token address"
                    onChange={handleTokenChange}        
                    />
                </label> <br></br>
                <label>
                    <input 
                    type="text" 
                    name="amount"
                    value={amount}
                    placeholder="Amount to withdraw"
                    onChange={handleAmountChange}        
                    />
                </label> <br></br>
                <label>
                    <input 
                    type="number" 
                    name="gasPrice"
                    value={gasPrice}
                    placeholder="Gas Price (GWei)"
                    onChange={handleGasPriceChange}
                    />
                </label> <br></br>
                <label>
                    <input 
                    type="number" 
                    name="nonce"
                    value={nonce}
                    placeholder="Nonce"
                    onChange={handleNonceChange}
                    />
                </label> <br></br>
                <input className="evm-button good" type="submit" value="Submit" /> 
            </form>
        </div>
        <Warning txToAccept={txToAccept} setTxToAccept={setTxToAccept} confirmDialogVisible={confirmDialogVisible} setConfirmDialogVisible={setConfirmDialogVisible}
                  setText={setText} myPrivateKey={myPrivateKey} blockExplorer={blockExplorer} api={api}/>
        <ShowQRCode visible={visible} setVisible={setVisible} text={text} setText={setText} />
    </div>
    ) : 
    (null)
}

export default WithdrawAave