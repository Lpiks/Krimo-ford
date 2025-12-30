import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import ModernSelect from '../../components/shared/ModernSelect';

const ProductFormPage = () => {
    const { t } = useTranslation();
    const [name, setName] = useState({ en: '', fr: '', ar: '' });
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState({ en: '', fr: '', ar: '' });
    const [oemNumber, setOemNumber] = useState('');
    const [sku, setSku] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState([]); // Changed from single image string to array
    const [compatibility, setCompatibility] = useState([]);
    const [tempYear, setTempYear] = useState('');
    const [tempModel, setTempModel] = useState('');
    const [fuelType, setFuelType] = useState('Essence');
    const [isFeatured, setIsFeatured] = useState(false);
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    const { userInfo } = useAuth();
    const isEditMode = !!id;

    const commonInputStyle = {
        width: '100%',
        padding: '0.75rem 1rem',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '0.95rem',
        backgroundColor: 'white',
        color: '#1f2937',
        outline: 'none',
        transition: 'all 0.2s',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        color: '#4b5563',
        fontSize: '0.9rem',
        fontWeight: '600'
    };

    const sectionStyle = {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        border: '1px solid rgba(0,0,0,0.05)',
        marginBottom: '2rem'
    };

    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableCarModels, setAvailableCarModels] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, carsRes] = await Promise.all([
                    axios.get('/api/categories'),
                    axios.get('/api/carmodels')
                ]);
                setAvailableCategories(catsRes.data);
                setAvailableCarModels(carsRes.data);
            } catch (error) {
                console.error("Failed to fetch lists", error);
            }
        };
        fetchData();

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
                    // Ensure images is always an array
                    setImages(data.images && Array.isArray(data.images) ? data.images : []);
                    setCompatibility(data.compatibility || []);
                    setFuelType(data.fuelType || 'Essence');
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
            images, // Sending the array directly
            compatibility,
            fuelType,
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
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        if (!userInfo) {
            toast.error('Please login to upload images');
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
            // Append new image URL to the array
            setImages(prev => [...prev, data.url]);
            setUploading(false);
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
            const status = error.response?.status || 'N/A';
            toast.error(`Upload Failed (Status: ${status}): ${errorMessage}`);
            setUploading(false);
        }
    };

    const removeImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: '#1f2937', fontSize: '1.8rem', fontWeight: 'bold' }}>
                        {isEditMode ? t('productForm.titleEdit') : t('productForm.titleNew')}
                    </h1>
                    <Link to="/admin/products" style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                    }}>
                        {t('common.cancel')}
                    </Link>
                </div>

                <form onSubmit={submitHandler}>
                    {/* Basic Info */}
                    <div style={sectionStyle}>
                        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--ford-blue)', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>Basic Information</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>{t('productForm.oem')}</label>
                                <input
                                    type="text"
                                    value={oemNumber}
                                    onChange={(e) => setOemNumber(e.target.value)}
                                    required
                                    style={commonInputStyle}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--ford-blue)'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>{t('productForm.sku')}</label>
                                <input
                                    type="text"
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    style={commonInputStyle}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--ford-blue)'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Localized Details */}
                    <div style={sectionStyle}>
                        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--ford-blue)', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>Product Details (Multilingual)</h2>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>{t('productForm.nameEn')}</label>
                            <input
                                type="text"
                                value={name.en}
                                onChange={(e) => setName({ ...name, en: e.target.value })}
                                required
                                style={commonInputStyle}
                                placeholder="Product Name in English"
                                onFocus={(e) => e.target.style.borderColor = 'var(--ford-blue)'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>{t('productForm.nameFr')}</label>
                                <input
                                    type="text"
                                    value={name.fr}
                                    onChange={(e) => setName({ ...name, fr: e.target.value })}
                                    style={{ ...commonInputStyle }}
                                    placeholder="Nom du produit"
                                    onFocus={(e) => e.target.style.borderColor = 'var(--ford-blue)'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>{t('productForm.nameAr')}</label>
                                <input
                                    type="text"
                                    value={name.ar}
                                    onChange={(e) => setName({ ...name, ar: e.target.value })}
                                    style={{ ...commonInputStyle, direction: 'rtl' }}
                                    placeholder="اسم المنتج"
                                    onFocus={(e) => e.target.style.borderColor = 'var(--ford-blue)'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>{t('productForm.descriptionEn')}</label>
                            <textarea
                                value={description.en}
                                onChange={(e) => setDescription({ ...description, en: e.target.value })}
                                style={{ ...commonInputStyle, minHeight: '100px', resize: 'vertical' }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--ford-blue)'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>{t('productForm.descriptionFr')}</label>
                                <textarea
                                    value={description.fr}
                                    onChange={(e) => setDescription({ ...description, fr: e.target.value })}
                                    style={{ ...commonInputStyle, minHeight: '100px', resize: 'vertical' }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--ford-blue)'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>{t('productForm.descriptionAr')}</label>
                                <textarea
                                    value={description.ar}
                                    onChange={(e) => setDescription({ ...description, ar: e.target.value })}
                                    style={{ ...commonInputStyle, minHeight: '100px', resize: 'vertical', direction: 'rtl' }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--ford-blue)'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Inventory & Category */}
                    <div style={sectionStyle}>
                        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--ford-blue)', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>Inventory & Categorization</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>{t('productForm.price')}</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    style={commonInputStyle}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--ford-blue)'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>{t('productForm.stock', 'Stock Quantity')}</label>
                                <input
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    required
                                    style={commonInputStyle}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--ford-blue)'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>{t('productForm.category')}</label>

                            {/* Quick Select Pills */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                {availableCategories.slice(0, 8).map(cat => (
                                    <button
                                        key={cat._id}
                                        type="button"
                                        onClick={() => setCategory(cat.name)}
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: '999px',
                                            border: category === cat.name ? '1px solid var(--ford-blue)' : '1px solid #e5e7eb',
                                            backgroundColor: category === cat.name ? 'var(--ford-blue)' : 'white',
                                            color: category === cat.name ? 'white' : '#4b5563',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            fontWeight: '500',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            <ModernSelect
                                options={availableCategories.map(cat => ({ value: cat.name, label: cat.name }))}
                                value={category}
                                onChange={(val) => setCategory(val)}
                                placeholder={t('common.select')}
                            />
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                                    <input
                                        type="checkbox"
                                        checked={isFeatured}
                                        onChange={(e) => setIsFeatured(e.target.checked)}
                                        style={{ width: '100%', height: '100%', cursor: 'pointer', opacity: 0.5 }}
                                    />
                                </div>
                                <span style={{ color: '#374151', fontWeight: '500' }}>{t('productForm.featured')}</span>
                            </label>
                        </div>
                    </div>

                    {/* Compatibility Section */}
                    <div style={sectionStyle}>
                        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--ford-blue)', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>{t('productForm.compatibility', 'Vehicle Compatibility')}</h2>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            {availableCarModels.slice(0, 10).map(m => (
                                <button
                                    key={m._id}
                                    type="button"
                                    onClick={() => setTempModel(m.name)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '999px',
                                        border: tempModel === m.name ? '1px solid #003478' : '1px solid #d1d5db',
                                        backgroundColor: tempModel === m.name ? '#003478' : 'white',
                                        color: tempModel === m.name ? 'white' : '#4b5563',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {m.name}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <input
                                    type="number"
                                    placeholder={t('productForm.year', 'Year')}
                                    value={tempYear}
                                    onChange={(e) => setTempYear(e.target.value)}
                                    style={commonInputStyle}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--ford-blue)'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <ModernSelect
                                    options={availableCarModels.map(m => ({ value: m.name, label: m.name }))}
                                    value={tempModel}
                                    onChange={(val) => setTempModel(val)}
                                    placeholder={t('common.selectModel', 'Select Model')}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (tempYear && tempModel) {
                                        setCompatibility([...compatibility, { year: tempYear, model: tempModel }]);
                                        setTempYear('');
                                        setTempModel('');
                                    }
                                }}
                                style={{
                                    backgroundColor: 'var(--ford-blue)',
                                    color: 'white',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    height: '42px', // Match input height approx
                                    display: 'flex', alignItems: 'center'
                                }}
                            >
                                {t('common.add', 'Add')}
                            </button>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Fuel Type</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {['Essence', 'Diesel'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFuelType(type)}
                                        style={{
                                            padding: '0.5rem 1.5rem',
                                            borderRadius: '8px',
                                            border: fuelType === type ? '2px solid var(--ford-blue)' : '1px solid #d1d5db',
                                            backgroundColor: fuelType === type ? '#eff6ff' : 'white',
                                            color: fuelType === type ? 'var(--ford-blue)' : '#4b5563',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                                        }}
                                    >
                                        <div style={{
                                            width: '18px', height: '18px', borderRadius: '50%', border: '2px solid currentColor',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {fuelType === type && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'currentColor' }}></div>}
                                        </div>
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {compatibility.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {compatibility.map((item, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: '#f3f4f6',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                        fontSize: '0.9rem',
                                        color: '#374151'
                                    }}>
                                        <span style={{ fontWeight: '600', marginRight: '0.5rem' }}>Ford {item.model}</span>
                                        <span style={{ color: '#6b7280' }}>({item.year})</span>
                                        <button type="button" onClick={() => {
                                            setCompatibility(compatibility.filter((_, i) => i !== index));
                                        }} style={{
                                            marginLeft: '0.75rem',
                                            color: '#ef4444',
                                            border: 'none',
                                            background: 'none',
                                            cursor: 'pointer',
                                            fontSize: '1.1rem',
                                            display: 'flex', alignItems: 'center'
                                        }}>×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Image Upload - Multi Image & Compact */}
                    <div style={sectionStyle}>
                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.1rem', color: '#1f2937' }}>Image field</label>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            {/* Existing Images */}
                            {images.map((imgUrl, index) => (
                                <div key={index} style={{ position: 'relative', width: '150px', height: '150px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                                    <img src={imgUrl} alt={`Product ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        style={{
                                            position: 'absolute', top: 5, right: 5,
                                            backgroundColor: '#ef4444', color: 'white',
                                            border: 'none', borderRadius: '50%',
                                            width: '24px', height: '24px',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            {/* Upload Button Block */}
                            <div className="file-upload-wrapper"
                                style={{
                                    position: 'relative',
                                    width: '150px',
                                    height: '150px',
                                    border: '2px dashed #d1d5db',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#f9fafb',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                }}
                                onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--ford-blue)'; e.currentTarget.style.backgroundColor = '#eff6ff'; }}
                                onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                                onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                            >
                                <input
                                    type="file"
                                    onChange={uploadFileHandler}
                                    accept="image/*"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        opacity: 0,
                                        cursor: 'pointer',
                                    }}
                                />
                                {uploading ? (
                                    <div style={{ color: 'var(--ford-blue)', fontSize: '0.9rem', fontWeight: 'bold' }}>...</div>
                                ) : (
                                    <>
                                        <div style={{ fontSize: '2rem', color: '#9ca3af', marginBottom: '0.2rem' }}>+</div>
                                        <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>Add Image</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Link to="/admin/products" style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            color: '#374151',
                            textDecoration: 'none',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}>
                            {t('common.cancel')}
                        </Link>
                        <button type="submit" className="btn btn-primary" style={{
                            padding: '0.75rem 2rem',
                            fontSize: '1rem',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 51, 153, 0.2)'
                        }}>
                            {t('common.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormPage;
