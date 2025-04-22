import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChromePicker } from 'react-color';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ColorManagement = () => {
    const [colors, setColors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedColor, setSelectedColor] = useState({ name: '', hex: '#000000' });
    const [editingIndex, setEditingIndex] = useState(-1);

    useEffect(() => {
        fetchColors();
    }, []);

    const fetchColors = async () => {
        try {
            const response = await axios.post('https://python.youngerlohas.com/settings/find', {
                query: { setting_id: 'younger_test' }
            });
            const colorsData = response.data.data[0].colors;
            setColors(colorsData);
        } catch (error) {
            console.error('Error fetching colors:', error);
        }
    };

    const handleColorChange = (color) => {
        setSelectedColor({ ...selectedColor, hex: color.hex });
    };

    const handleNameChange = (e) => {
        setSelectedColor({ ...selectedColor, name: e.target.value });
    };

    const handleSave = async () => {
        try {
            if (editingIndex === -1) {
                // Create new color using upsert, including existing colors
                await axios.post('https://python.youngerlohas.com/settings/upsert', {
                    find: { setting_id: 'younger_test' },
                    upsert: {
                        colors: [...colors, { ...selectedColor }]
                    }
                });
            } else {
                // Update existing color
                await axios.post('https://python.youngerlohas.com/settings/upsert', {
                    find: { name: colors[editingIndex].name },
                    upsert: { ...selectedColor }
                });
            }
            fetchColors();
            setShowModal(false);
            setSelectedColor({ name: '', hex: '#000000' });
            setEditingIndex(-1);
        } catch (error) {
            console.error('Error saving color:', error);
        }
    };

    const handleEdit = (index) => {
        setSelectedColor(colors[index]);
        setEditingIndex(index);
        setShowModal(true);
    };

    const handleDelete = async (index) => {
        try {
            // Filter out the color to be deleted
            const updatedColors = colors.filter((_, i) => i !== index);

            // Update the document with the new array of colors
            await axios.post('https://python.youngerlohas.com/settings/upsert', {
                find: { setting_id: 'younger_test' },
                upsert: {
                    colors: updatedColors
                }
            });
            fetchColors();
        } catch (error) {
            console.error('Error deleting color:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>顏色管理</h2>
            <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
                新增顏色
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>顏色名稱</th>
                        <th>顏色預覽</th>
                        <th>色碼</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {colors.map((color, index) => (
                        <tr key={index}>
                            <td>{color.name}</td>
                            <td>
                                <div
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        backgroundColor: color.hex,
                                        border: '1px solid #ccc'
                                    }}
                                />
                            </td>
                            <td>{color.hex}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => handleEdit(index)}
                                    className="me-2"
                                >
                                    編輯
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(index)}
                                >
                                    刪除
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingIndex === -1 ? '新增顏色' : '編輯顏色'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>顏色名稱</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedColor.name}
                                onChange={handleNameChange}
                                placeholder="輸入顏色名稱"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>選擇顏色</Form.Label>
                            <ChromePicker
                                color={selectedColor.hex}
                                onChange={handleColorChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        取消
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        儲存
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ColorManagement; 