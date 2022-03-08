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
    <div className='add-pizza-container'>
      <div className="row">
        <div className="col-12 col-md-9 col-lg-8 m-auto">
          
          <div className="card mt-4">
            <div className="card-body">
              <h1 className="text-center mb-4">Add Item</h1>

              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="font-weight-bold">Name of the Item *</label>
                    <input
                      className="form-control"
                      type="text"
                      name="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)} 
                    />
                  </div>

                  <div className="form-group">
                    <label className="font-weight-bold">Prize *</label>
                    <div className="d-flex align-items-center">
                      <div className="input-group mb-3 w-50">
                        <input
                          className="form-control "
                          type="number"
                          name="Prize"
                          value={prize}
                          onChange={(e) => handlePrize(e)} 
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">{currentNetwork}</span>
                        </div>
                      </div>
                      <p>${finalPrize}</p>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="font-weight-bold">Image of your Item</label>
                    <div className="input-group">
                      <div className="custom-file">
                        <input type="file" className="custom-file-input" onChange={getFile} />
                        <label className="custom-file-label">{fileName ? fileName : "Choose file"}</label>
                      </div>
                    </div>
                    <p className="text-muted">* Image you upload cannot be removed</p>
                  </div>

                  <div className="form-group">
                    <label className="font-weight-bold">Description *</label>
                    <textarea
                      className="form-control"
                      type="text"
                      name="description"
                      rows="5"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}  />
                  </div>
                </div>
              </div>

              {!loading ? (
                <button
                  className="btn primary-bg-color btn-lg w-25 float-right"
                  onClick={addItem}
                  disabled={!name || !prize || !description}>
                  Create
                </button>
              ) : (
                <center>
                  {/* <Spinner /> */}
                </center>
              ) }
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
