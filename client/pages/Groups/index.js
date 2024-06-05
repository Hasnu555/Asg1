import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../context";
import { Button, List, Modal, Form, Input, Upload, Avatar } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [state] = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (state && state.token) {
      fetchGroups();
    } else {
      router.push("/login");
    }
  }, [state]);

  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://localhost:5000/group/myGroups", {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setGroups([]);
    }
  };

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
      fetchGroups();
      toast.success("Group created successfully!");
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Error creating group");
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await axios.post(`http://localhost:5000/group/${groupId}/join`, null, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      fetchGroups();
      toast.success("Joined group successfully!");
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("Error joining group");
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      await axios.post(`http://localhost:5000/group/${groupId}/leave`, null, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      fetchGroups();
      toast.success("Left group successfully!");
    } catch (error) {
      console.error("Error leaving group:", error);
      toast.error("Error leaving group");
    }
  };

  const showCreateModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-light">Groups</h1>
      <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal}>
        Create Group
      </Button>
      <Modal
        title="Create Group"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={createGroup}>
          <Form.Item
            name="name"
            label="Group Name"
            rules={[
              { required: true, message: "Please input the group name!" },
            ]}
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
      </Modal>
      <List
        itemLayout="horizontal"
        dataSource={groups}
        renderItem={(group) => (
          <List.Item
            actions={[
              <Button
                type="link"
                onClick={() => router.push(`/groups/${group._id}`)}
              >
                View
              </Button>,
              <Button type="link" onClick={() => handleJoinGroup(group._id)}>
                Join
              </Button>,
              <Button type="link" onClick={() => handleLeaveGroup(group._id)}>
                Leave
              </Button>,
            ]}
            className="group-page list-group-item"
          >
            <List.Item.Meta
              avatar={<Avatar src={group.image} />}
              title={<span style={{ color: "#ffffff" }}>{group.name}</span>}
              description={
                <span style={{ color: "#ffffff" }}>{group.description}</span>
              }
            />
          </List.Item>
        )}
        className="group-list"
      />
    </div>
  );
};

export default Groups;
