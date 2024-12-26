import { Button, Form, Input, Modal, Table, message } from "antd";
import React, { useState } from "react";

const Edit = ({
  isEditModalOpen,
  setIsEditModalOpen,
  categories,
  setCategories,
}) => {
  const [editingRow, seteditingRow] = useState({});

  const onFinish = (values) => {
    console.log(values);
    try {
      fetch("/api/categories/update/" + [editingRow.id], {
        method: "PUT",
        body: JSON.stringify({ ...values }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      message.success("Kategori başarıyla güncellendi.");
      //item.id ile editingRow.id si eşit olanın title 'nı döndür.
      setCategories(
        categories.map((item) => {
          if (item.id === editingRow.id) {
            //tüm icerikler aynı olsun. values'in içindeki gönderilen title
            return { ...item, title: values.title };
          }
          //düz item'ı gönder.
          return item;
        })
      );
    } catch (error) {
      message.error("Bir seyler yanlis gitti");
      console.log(error);
    }
  };

  const deleteCategory = (id) => {
    if (window.confirm("Emin Misin ?")) {
      try {
        fetch("/api/categories/delete/" + [id], {
          method: "DELETE",
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        message.success("Kategori basariyla silindi");
        setCategories(categories.filter((item) => item.id !== id));
      } catch (error) {
        message.error("Bir seyler yanlis gitti");
        console.log(error);
      }
    }
  };

  const columns = [
    {
      title: "Category Title",
      dataIndex: "title",
      render: (_, record) => {
        if (record.id === editingRow.id) {
          return (
            <Form.Item className="mb-0" name="title">
              <Input defaultValue={record.title} />
            </Form.Item>
          );
        } else {
          return <p>{record.title}</p>;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <div>
            <Button
              type="text"
              onClick={() => {
                seteditingRow(record);
              }}
              className="pl-0"
            >
              Duzenle
            </Button>
            <Button type="text" htmlType="submit">
              Kaydet
            </Button>
            <Button
              type="text"
              danger
              onClick={() => deleteCategory(record.id)}
            >
              sil
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <Modal
      title="Kategori Islemleri"
      open={isEditModalOpen}
      footer={false}
      onCancel={() => setIsEditModalOpen(false)}
    >
      <Form onFinish={onFinish}>
        <Table
          bordered
          columns={columns}
          dataSource={categories}
          rowKey={"id"}
        />
      </Form>
    </Modal>
  );
};

export default Edit;
