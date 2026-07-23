package com.wms.dto;

public class RepairDTO {
    private String watchModel;
    private String problemDescription;
    private String priority;
    private Double serviceCost;
    private String partsUsed;
    private String customerName;
    private String customerPhone;
    private Integer technicianId;
    private String status;

    public String getWatchModel() { return watchModel; }
    public void setWatchModel(String watchModel) { this.watchModel = watchModel; }
    public String getProblemDescription() { return problemDescription; }
    public void setProblemDescription(String problemDescription) { this.problemDescription = problemDescription; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public Double getServiceCost() { return serviceCost; }
    public void setServiceCost(Double serviceCost) { this.serviceCost = serviceCost; }
    public String getPartsUsed() { return partsUsed; }
    public void setPartsUsed(String partsUsed) { this.partsUsed = partsUsed; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    public Integer getTechnicianId() { return technicianId; }
    public void setTechnicianId(Integer technicianId) { this.technicianId = technicianId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}