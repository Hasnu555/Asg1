import React from "react";
import { Form, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const GroupPostForm = ({
  content,
  setContent,
  postSubmit,
  handleImage,
  uploading,
  image,
}) => (
  <Form onFinish={postSubmit} className="create-post-form mt-4">
    <Form.Item>
      <Input.TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        required
        className="quill-editor"
        style={{
          backgroundColor: "#2c2c2c",
          color: "#ffffff",
          borderRadius: "5px",
        }}
      />
    </Form.Item>
    <Form.Item>
      <Upload beforeUpload={handleImage} listType="picture">
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
    </Form.Item>
    <Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        className="post-button"
        disabled={uploading}
      >
        {uploading ? "Posting..." : "Post"}
      </Button>
    </Form.Item>
  </Form>
);

export default GroupPostForm;
