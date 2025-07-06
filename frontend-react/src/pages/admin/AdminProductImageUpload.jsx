import React, { useState } from 'react';
import { Box, Typography, Button, MenuItem, Select, InputLabel, FormControl, Paper, LinearProgress, Alert } from '@mui/material';
import { useMutation, useQuery, gql } from '@apollo/client';
import { UPLOAD_MUTATION } from '../../graphql/upload';
import { GET_ALL_PRODUCTS } from '../../graphql/products';

const AdminProductImageUpload = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [upload, { loading }] = useMutation(UPLOAD_MUTATION);
  const { data, loading: loadingProducts, error: errorProducts } = useQuery(GET_ALL_PRODUCTS);

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
    setStatus('');
    setError('');
  };
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
    setStatus('');
    setError('');
  };
  const handleUpload = async () => {
    if (!selectedProduct || !file) {
      setError('Please select a product and an image file.');
      return;
    }
    setError('');
    setStatus('');
    try {
      const { data } = await upload({ variables: { file } });
      if (data && data.upload) {
        setStatus('Upload successful!');
      } else {
        setError('Upload failed.');
      }
    } catch (e) {
      setError('Upload error: ' + e.message);
    }
  };

  const products = data?.products?.items || [];

  return (
    <Paper sx={{ p: 4, maxWidth: 480, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Admin: Upload Product Image</Typography>
      <FormControl fullWidth sx={{ mb: 2 }} disabled={loadingProducts}>
        <InputLabel id="product-label">Product</InputLabel>
        <Select
          labelId="product-label"
          value={selectedProduct}
          label="Product"
          onChange={handleProductChange}
        >
          {products.map((p) => (
            <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {errorProducts && <Alert severity="error" sx={{ mb: 2 }}>Failed to load products</Alert>}
      <Button variant="contained" component="label" sx={{ mb: 2 }}>
        Select Image
        <input type="file" accept="image/*" hidden onChange={handleFileChange} />
      </Button>
      {preview && (
        <Box sx={{ mb: 2 }}>
          <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 8 }} />
        </Box>
      )}
      <Button variant="contained" color="primary" onClick={handleUpload} disabled={loading || !file || !selectedProduct} sx={{ bgcolor: '#e87722', fontWeight: 700, mb: 2 }}>
        {loading ? 'Uploading...' : 'Upload'}
      </Button>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {status && <Alert severity="success" sx={{ mb: 2 }}>{status}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    </Paper>
  );
};

export default AdminProductImageUpload; 