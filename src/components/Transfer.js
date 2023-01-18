import "../styles/Transfer.css"
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import QRCode from "react-qr-code"
import Warning from "./Warning"

function Transfer({ myPrivateKey, isInitialized, chain, api, blockExplorer }) {

    const [recipient, setRecipient] = useState('')
    const [value, setValue] = useState('')
    const [gasPrice, setGasPrice] = useState('')
    const [nonce, setNonce] = useState('')
    const [text, setText] = useState('')
    const [visible, setVisible] = useState(false)
    const [txToAccept, setTxToAccept] = useState('')
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false)

    const handleRecipientChange = event => {
        setRecipient(event.target.value.replace(/\s/g, ''))
    }
    const handleValueChange = event => { 
        setValue(event.target.value.replace(/\s/g, ''))
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
        if (!ethers.utils.isAddress(recipient) || !(parseFloat(value) > 0)) {
            alert('Invalid input format.')
        } else {
            const formData = {
                recipient, 
                value, 
                gasPrice,
                nonce
            
            }
            processSubmittedDataFunction(formData);
            setRecipient('')
            setValue('')
            setGasPrice('')
            setNonce('')  
        }
    }

    async function processSubmittedDataFunction(formData) {

        const unsigned_tx = {
            chainId: parseInt(chain),
            to: formData.recipient,
            value: ethers.utils.parseEther(formData.value),
            gasPrice: formData.gasPrice*1e9,
            gasLimit: 21000,
            nonce: parseInt(formData.nonce)
        }

        setTxToAccept(unsigned_tx)
    
    }

    const resetText = () => {
        setText("")
    }

    useEffect(() => {
        text.length > 0 ? setVisible(true) : setVisible(false)
      }, [text]);

    return isInitialized ? (
    <div>
        <div className="evm-transfer">
            <p className="evm-columns">Transfer Ether.</p>
            <form className="evm-columns" onSubmit={handleSubmit}>
                <label>
                    <input 
                    type="text" 
                    name="recipient"
                    value={recipient}
                    placeholder="Recipient"
                    onChange={handleRecipientChange}
                    />
                </label> <br></br>
                <label>
                    <input 
                    type="text" 
                    name="value"
                    value={value}
                    placeholder="Value"
                    onChange={handleValueChange}        
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
                <input type="submit" value="Submit and sign" /> 
            </form>
        </div>
        <Warning txToAccept={txToAccept} setTxToAccept={setTxToAccept} confirmDialogVisible={confirmDialogVisible} setConfirmDialogVisible={setConfirmDialogVisible}
                  setText={setText} myPrivateKey={myPrivateKey} blockExplorer={blockExplorer} api={api}/>
        {visible ? 
            <div className="center" >
                <QRCode value={text} /> <br></br>
                <button onClick={resetText}>Hide QR</button>
            </div>
            
        : null}
    </div>
    ) : 
    (null)
}

export default Transfer