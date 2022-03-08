import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ipfsClient from 'ipfs-http-client';

const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export default function AddItem({ createItem, getPrice, currentNetwork }) {

  const history = useHistory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prize, setPrize] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [buffer, setBuffer] = useState('');
  const [finalPrize, setFinalPrize] = useState(0);

  async function addItem() {
    try {
      setLoading(true); 
      if (buffer) {
        ipfs.add(buffer, async (error, result) => {
          if (error) {
            console.log(error);
          }
          await createItem(name, description, result[0].hash, prize);
          history.push('/');
        });
      }
      else {
        await createItem(name, description, '', prize);
        history.push('/');
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  const getFile = e => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setFileName(file.name);
      setBuffer(Buffer(reader.result));
    }
  }

  const handlePrize = async e => {
    setPrize(e.target.value);
    const usdValue = await getPrice();
    let totalUSDValue = (usdValue * e.target.value) / 100000000;
    setFinalPrize(Number.parseFloat(totalUSDValue).toFixed(2));
  }

  return (
    <div>AddItem</div>
  )
}
