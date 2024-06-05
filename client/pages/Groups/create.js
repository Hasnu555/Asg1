import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../context";
import { Form, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const CreateGroup = () => {
  const [form] = Form.useForm();
  const [state] = useContext(UserContext);

  const createGroup = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    if (values.image) formData.append("image", values.image.file);

    try {
      await axios.post("http://localhost:5000/group/create", formData, {
        headers: {
          Authorization: `Bearer ${state.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Group created successfully!");
      form.resetFields();
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Error creating group");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Create Group</h1>
      <Form form={form} layout="vertical" onFinish={createGroup}>
        <Form.Item
          name="name"
          label="Group Name"
          rules={[{ required: true, message: "Please input the group name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Group Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="image" label="Group Image">
          <Upload listType="picture" beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateGroup;
