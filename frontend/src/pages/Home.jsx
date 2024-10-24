import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ClassCard from "../components/home-view/ClassCard";
import { fetchClasses } from "../store/classSlice";
import Banner from "../components/common/Banner";
import Spinner from "../components/common/Spinner";
import Alert from "../components/common/Alert"
import StudySVG from "../assets/svg/study.svg";
import VoidSVG from "../assets/svg/void.svg";

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { createdClasses, joinedClasses, loading, error } = useSelector(
    (state) => state.class
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    } else {
      dispatch(fetchClasses());
    }
  }, [dispatch, isAuthenticated, navigate]);

  return (
    <div>
      <Banner
        SVGComponent={StudySVG}
        heading="Classes"
        bannerBackground="boxes"
        customText="All your classes at one place"
        textColor="gray"
      />
      <div className="my-2 flex flex-row sm:items-center sm:justify-center">
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="w-3/4 mx-auto">
            <Alert color="red" message={error} />
          </div>
        ) : (
          <>
            {joinedClasses.length === 0 && createdClasses.length === 0 && (
              <div className="w-full">
                <div className="w-60 mx-auto">
                  <img alt="" src={VoidSVG} />
                  <h3 className="text-sm text-gray-600 my-6">
                    You haven't joined or created any class
                  </h3>
                </div>
              </div>
            )}
            <div className="p-4 flex flex-row flex-wrap sm:items-center sm:justify-center">
              {createdClasses.map((element) => (
                <div className="w-72 m-6" key={element._id}>
                  <ClassCard
                    classTitle={element.className}
                    classRoom={element.classRoom}
                    classTeacher="Teacher"
                    classCode={element._id}
                    instructorName={element.createdBy.name}
                  />
                </div>
              ))}

              {joinedClasses.map((element) => (
                <div key={element._id} className="w-72 m-6">
                  <ClassCard
                    classTitle={element.className}
                    classRoom={element.room}
                    classCode={element._id}
                    instructorName={element.createdBy.name}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
