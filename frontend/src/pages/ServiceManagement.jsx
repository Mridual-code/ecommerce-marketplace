import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../api/axios";
import "../styles/services.css";

const initialForm = {
  name: "",
  category: "",
  description: "",
  image: "",
  startingPrice: "",
  duration: "",
  features: "",
  isAvailable: true
};

function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] =
    useState(null);

  const fetchServices = async () => {
    try {
      const res = await API.get("/services");
      setServices(res.data.services || []);
    } catch (error) {
      toast.error("Failed to load services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox" ? checked : value
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const submitService = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      startingPrice: Number(
        form.startingPrice
      ),
      features: form.features
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean)
    };

    try {
      if (editingId) {
        await API.put(
          `/services/${editingId}`,
          payload
        );
        toast.success("Service updated");
      } else {
        await API.post("/services", payload);
        toast.success("Service created");
      }

      resetForm();
      fetchServices();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Service operation failed"
      );
    }
  };

  const editService = (service) => {
    setEditingId(service._id);

    setForm({
      name: service.name || "",
      category: service.category || "",
      description: service.description || "",
      image: service.image || "",
      startingPrice:
        service.startingPrice ?? "",
      duration: service.duration || "",
      features:
        service.features?.join(", ") || "",
      isAvailable: service.isAvailable
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) {
      return;
    }

    try {
      await API.delete(`/services/${id}`);
      toast.success("Service deleted");
      fetchServices();
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  return (
    <main className="service-management-page">
      <h1>Service Management</h1>

      <form
        className="service-admin-form"
        onSubmit={submitService}
      >
        <input
          name="name"
          placeholder="Service Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />

        <input
          name="startingPrice"
          type="number"
          min="0"
          placeholder="Starting Price"
          value={form.startingPrice}
          onChange={handleChange}
          required
        />

        <input
          name="duration"
          placeholder="Duration"
          value={form.duration}
          onChange={handleChange}
          required
        />

        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
        />

        <input
          name="features"
          placeholder="Features separated by commas"
          value={form.features}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Service Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <label className="availability-field">
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
          />
          Service Available
        </label>

        <button type="submit">
          {editingId
            ? "Update Service"
            : "Create Service"}
        </button>

        {editingId && (
          <button
            type="button"
            className="cancel-edit-button"
            onClick={resetForm}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="service-admin-grid">
        {services.map((service) => (
          <article
            className="service-admin-card"
            key={service._id}
          >
            <h2>{service.name}</h2>
            <p>{service.category}</p>
            <strong>
              ₹
              {Number(
                service.startingPrice
              ).toLocaleString("en-IN")}
            </strong>

            <span>
              {service.isAvailable
                ? "Available"
                : "Unavailable"}
            </span>

            <div>
              <button
                onClick={() =>
                  editService(service)
                }
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteService(service._id)
                }
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export default ServiceManagement;