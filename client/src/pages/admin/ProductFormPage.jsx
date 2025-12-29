import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

const ProductFormPage = () => {
    const { t } = useTranslation();
    const [name, setName] = useState({ en: '', fr: '', ar: '' });
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState({ en: '', fr: '', ar: '' });
    const [oemNumber, setOemNumber] = useState('');
    const [sku, setSku] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [image, setImage] = useState('');
    const [compatibility, setCompatibility] = useState([]);
    const [tempYear, setTempYear] = useState('');
    const [tempModel, setTempModel] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    const { userInfo } = useAuth();
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const { data } = await axios.get(`/api/products/${id}`);
                    setName(data.name || { en: '', fr: '', ar: '' });
                    setPrice(data.price);
                    setDescription(data.description || { en: '', fr: '', ar: '' });
                    setOemNumber(data.oemNumber);
                    setSku(data.sku);
                    setCategory(data.category);
                    setStock(data.stock);
                    setImage(data.images && data.images[0] ? data.images[0] : '');
                    setCompatibility(data.compatibility || []);
                    setIsFeatured(data.isFeatured || false);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const productData = {
            name,
            price,
            description,
            oemNumber,
            sku,
            category,
            stock,
            images: [image],
            compatibility,
            isFeatured
        };

        if (!userInfo) {
            toast.error('Please login to save products');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            if (isEditMode) {
                await axios.put(`/api/products/${id}`, productData, config);
                toast.success('Product Updated Successfully');
            } else {
                await axios.post('/api/products', productData, config);
                toast.success('Product Created Successfully');
            }
            navigate('/admin/products');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Error saving product');
        }
    };



    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        if (!userInfo) {
            alert('Please login to upload images');
            setUploading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);
            setImage(data.url); // Fix: Extract URL from response object
            setUploading(false);
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
            const status = error.response?.status || 'N/A';
            toast.error(`Upload Failed (Status: ${status}): ${errorMessage}`);
            setUploading(false);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <Link to="/admin/products" className="btn btn-light" style={{ marginBottom: '1rem', display: 'inline-block' }}>{t('common.cancel')}</Link>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '2rem', color: 'var(--ford-blue)' }}>{isEditMode ? t('productForm.titleEdit') : t('productForm.titleNew')}</h1>
                <form onSubmit={submitHandler}>
                    {/* Basic Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('productForm.oem')}</label>
                            <input type="text" value={oemNumber} onChange={(e) => setOemNumber(e.target.value)} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('productForm.sku')}</label>
                            <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                    </div>

                    {/* Localized Names */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('productForm.nameEn')}</label>
                            <input type="text" value={name.en} onChange={(e) => setName({ ...name, en: e.target.value })} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('productForm.nameFr')}</label>
                            <input type="text" value={name.fr} onChange={(e) => setName({ ...name, fr: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('productForm.nameAr')}</label>
                            <input type="text" value={name.ar} onChange={(e) => setName({ ...name, ar: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', direction: 'rtl' }} />
                        </div>
                    </div>

                    {/* Localized Descriptions */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('productForm.descriptionEn')}</label>
                        <textarea value={description.en} onChange={(e) => setDescription({ ...description, en: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', minHeight: '80px' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('productForm.descriptionFr')}</label>
                        <textarea value={description.fr} onChange={(e) => setDescription({ ...description, fr: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', minHeight: '80px' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('productForm.descriptionAr')}</label>
                        <textarea value={description.ar} onChange={(e) => setDescription({ ...description, ar: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', minHeight: '80px', direction: 'rtl' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('productForm.price')}</label>
                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                    </div>

                    {/* Compatibility Section */}
                    <div style={{ marginBottom: '2rem', border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{t('productForm.compatibility', 'Vehicle Compatibility')}</label>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                            {['Fiesta', 'Focus', 'Ranger', 'Kuga', 'Ecosport', 'Everest', 'Mustang', 'Transit'].map(m => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setTempModel(m)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '50px',
                                        border: '1px solid #003478',
                                        backgroundColor: tempModel === m ? '#003478' : 'white',
                                        color: tempModel === m ? 'white' : '#003478',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <input
                                type="number"
                                placeholder={t('productForm.year', 'Year')}
                                value={tempYear}
                                onChange={(e) => setTempYear(e.target.value)}
                                style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                            <select
                                value={tempModel}
                                onChange={(e) => setTempModel(e.target.value)}
                                style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                            >
                                <option value="">{t('common.selectModel', 'Select Model')}</option>
                                <option value="Fiesta">Fiesta</option>
                                <option value="Focus">Focus</option>
                                <option value="Ranger">Ranger</option>
                                <option value="Kuga">Kuga</option>
                                <option value="Ecosport">Ecosport</option>
                                <option value="Everest">Everest</option>
                                <option value="Mustang">Mustang</option>
                                <option value="Transit">Transit</option>
                            </select>
                            <button type="button" className="btn btn-primary" onClick={() => {
                                if (tempYear && tempModel) {
                                    setCompatibility([...compatibility, { year: tempYear, model: tempModel }]);
                                    setTempYear('');
                                    setTempModel('');
                                }
                            }}>{t('common.add', 'Add')}</button>
                        </div>

                        {compatibility.length > 0 && (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {compatibility.map((item, index) => (
                                    <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '4px' }}>
                                        <span>Ford {item.model} ({item.year})</span>
                                        <button type="button" onClick={() => {
                                            setCompatibility(compatibility.filter((_, i) => i !== index));
                                        }} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('productForm.category')}</label>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            {['Brakes', 'Filters', 'Suspension', 'Engine', 'Electrical', 'Body', 'Accessories'].map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    style={{
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '20px',
                                        border: '1px solid #666',
                                        backgroundColor: category === cat ? '#666' : 'white',
                                        color: category === cat ? 'white' : '#666',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                            <option value="">{t('common.select')}</option>
                            <option value="Brakes">Brakes</option>
                            <option value="Filters">Filters</option>
                            <option value="Suspension">Suspension</option>
                            <option value="Engine">Engine</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Body">Body</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                            {t('productForm.featured')}
                        </label>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{t('productForm.image')}</label>

                        <div className="file-upload-wrapper">
                            <input
                                type="file"
                                className="file-upload-input"
                                onChange={uploadFileHandler}
                                accept="image/*"
                            />
                            {image ? (
                                <img src={image} alt="Preview" className="file-upload-preview" />
                            ) : (
                                <div className="file-upload-content">
                                    <div className="upload-icon">📁</div>
                                    <p>{t('common.select') || 'Click or Drag to Upload'}</p>
                                </div>
                            )}
                            {uploading && (
                                <div className="loading-overlay">
                                    {t('common.loading')}
                                </div>
                            )}
                        </div>
                        {/* Hidden input to store value for form submission if needed, or just leverage state */}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>{t('common.save')}</button>
                </form>
            </div>
        </div>
    );
};


export default ProductFormPage;
