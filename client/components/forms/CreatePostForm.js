import { Avatar } from "antd";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }); // dynamic import
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons'



const CreatePostForm = ({ content, setContent, postSubmit, handleImage, image, uploading }) => {
  return (
    <div className="card">
      <div className="card-body pb-3">
        <form className="form-group">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={(e) => setContent(e)}
            className="form-control"
            placeholder="Write something"
          />
          <input onChange={handleImage} type="file" accept="image/*" hidden id="file-upload"/>
          <label htmlFor="file-upload" className="btn btn-outline-secondary btn-sm mt-2" style={{backgroundColor: 'blue', color: 'white'}}>
            {uploading ? <LoadingOutlined /> : <CameraOutlined />}
            
          </label>
        </form>
      </div>
      <div className="card-footer d-flex justify-content-between text-muted">
        <button onClick={postSubmit} className="btn btn-primary mt-1 btn-sm">
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePostForm;
