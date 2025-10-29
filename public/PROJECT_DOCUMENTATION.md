# 芜湖医保数据查询系统 (WHYB_WJDC) 项目文档

## 项目概述

**项目名称**: whyb_wjdc (芜湖医保数据查询系统)  
**技术栈**: Spring Boot 3.5.6 + MyBatis Plus + MySQL + Spring Security + JWT  
**Java版本**: 17  
**端口**: 8087  

这是一个基于Spring Boot的医疗数据查询系统，主要用于管理和查询芜湖地区的医疗机构、药店、区域信息等医疗相关数据。系统采用多数据源架构，支持JWT认证，提供RESTful API接口。

## 项目架构

### 技术架构
- **后端框架**: Spring Boot 3.5.6
- **数据库**: MySQL (7个数据源)
- **ORM框架**: MyBatis Plus 3.5.3.2
- **安全框架**: Spring Security + JWT
- **API文档**: Knife4j (Swagger)
- **地理信息处理**: JTS + GeoTools
- **构建工具**: Maven
- **开发工具**: Lombok

### 数据源配置
系统配置了7个MySQL数据源：
1. **db1**: theme_ddmedical_institutions_info (医疗机构信息)
2. **db2**: theme_region (区域信息)
3. **db3**: theme_psn_insu (参保人员信息)
4. **db4**: theme_medical_institutions_info (医疗机构详细信息)
5. **db5**: theme_medical_service_info (医疗服务信息)
6. **db6**: theme_auth (认证授权)
7. **db7**: theme_temp_data (临时数据)

## 核心包结构分析

### 1. 主启动类

#### `WhybWjdcApplication.java`
```java
@EnableScheduling // 启用定时任务
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@MapperScan("org.a7s.whyb_wjdc.mapper") // 扫描整个 mapper 包
public class WhybWjdcApplication {
    public static void main(String[] args) {
        SpringApplication.run(WhybWjdcApplication.class, args);
    }
}
```

**功能说明**:
- Spring Boot应用的主启动类
- 启用了定时任务功能
- 排除了默认的数据源自动配置，使用自定义多数据源配置
- 扫描mapper包下的所有Mapper接口

### 2. 配置包 (config)

#### `Db1MyBatisConfig.java` - `Db7MyBatisConfig.java`
**功能**: 多数据源MyBatis配置类

**主要方法**:
- `dbXDataSource()`: 创建数据源Bean
- `dbXSqlSessionFactory()`: 创建SqlSessionFactory
- `dbXSqlSessionTemplate()`: 创建SqlSessionTemplate

**配置特点**:
- 每个数据源对应不同的数据库
- 使用`@ConfigurationProperties`从配置文件读取数据源配置
- 分别扫描不同的mapper包和XML文件

#### `SecurityConfig.java`
**功能**: Spring Security安全配置

**主要方法**:
- `passwordEncoder()`: BCrypt密码编码器
- `authenticationManager()`: 认证管理器
- `filterChain()`: 安全过滤链配置

**安全特性**:
- 禁用CSRF（使用JWT）
- 无状态会话管理
- 开发阶段允许所有请求
- 集成JWT认证过滤器

### 3. 通用类包 (common)

#### `Result.java`
**功能**: 统一响应结果封装类

**主要方法**:
- `success()`: 成功响应（无数据）
- `success(T data)`: 成功响应（带数据）
- `success(String message, T data)`: 成功响应（带消息和数据）
- `error()`: 失败响应
- `error(String message)`: 失败响应（带消息）
- `error(Integer code, String message)`: 失败响应（带状态码和消息）
- `unauthorized()`: 未授权响应
- `forbidden()`: 禁止访问响应
- `notFound()`: 资源未找到响应

**字段说明**:
- `code`: 响应码
- `message`: 响应消息
- `data`: 响应数据
- `timestamp`: 时间戳

### 4. 实体类包 (model)

#### `MedicalInstitutionModel.java`
**功能**: 医疗机构信息实体类

**主要字段**:
- `id`: 唯一标识符
- `hospitalId`: 医疗机构ID
- `hospitalName`: 医疗机构名称
- `hospitalAddress`: 医疗机构地址
- `hospitalLevel`: 医疗机构等级
- `approvedBed`: 核定床位数
- `openBed`: 开放床位数
- `hospitalDepartments`: 医疗机构科室
- `hospitalDescription`: 医疗机构简介
- `hospitalDistrict`: 医疗机构所属区域
- `businessNature`: 医疗机构经营性质
- `hospitalLongitude`: 经度
- `hospitalLatitude`: 纬度
- `startDate`: 开始生效时间
- `endDate`: 结束生效时间
- `sign`: 农村/城市标识
- `doctorNum`: 医生数量

#### `PharmacyInfoModel.java`
**功能**: 药店信息实体类

**主要字段**:
- `id`: 唯一标识符
- `pharmacyId`: 药店ID
- `pharmacyName`: 药店名称
- `pharmacyType`: 药店类型
- `pharmacyAddress`: 药店地址
- `pharmacyDistrict`: 药店所在区县
- `pharmacyLongitude`: 经度
- `pharmacyLatitude`: 纬度
- `startDate`: 开始生效时间
- `endDate`: 结束生效时间
- `sign`: 农村/城市标识

#### `RegionInfoModel.java`
**功能**: 区域信息实体类

**主要字段**:
- `id`: 唯一标识符
- `regionId`: 区域ID
- `regionName`: 区域名称
- `villageCommunity`: 所属村居
- `regionPopulation`: 人口
- `townStreet`: 镇街
- `countyDistrict`: 县区
- `geometry`: 网格坐标集合（JSON格式）
- `regionInclude`: 包含的小区块
- `geometryList`: 解析后的坐标列表

#### `SysUserModel.java`
**功能**: 系统用户实体类

**主要字段**:
- `id`: 用户ID
- `username`: 用户名
- `password`: 加密后的密码
- `nickname`: 昵称
- `email`: 邮箱
- `phone`: 手机号
- `status`: 状态（1启用，0禁用）
- `createTime`: 创建时间
- `updateTime`: 更新时间

#### `SysRoleModel.java`
**功能**: 系统角色实体类

**主要字段**:
- `id`: 角色ID
- `roleName`: 角色英文名
- `roleLabel`: 角色中文描述
- `status`: 状态（1启用，0禁用）
- `createTime`: 创建时间
- `updateTime`: 更新时间

#### `RoadNetworkModel.java`
**功能**: 道路网络实体类

**主要字段**:
- `id`: 唯一标识符
- `roadId`: 道路ID
- `roadClass`: 道路类型
- `roadAlias`: 道路名称
- `roadGeometry`: 道路几何图形

#### `TempDataModel.java`
**功能**: 临时数据实体类

**主要字段**:
- `resName`: 数据名称
- `resValue`: 数据值
- `resValueOld`: 数据值（旧）
- `updateTime`: 更新时间

#### `MedInsDoctorModel.java`
**功能**: 医疗机构医生信息实体类

**主要字段**:
- `drCode`: 医师编码
- `drName`: 医师姓名
- `drPracScpCode`: 医师执业范围
- `drPracType`: 医师执业类型
- `drPracScpName`: 医师执业专科
- `pracRegn`: 执业注册号
- `mainPracinsNo`: 主要执业机构编号
- `medinsCode`: 医疗机构编码
- `medinsName`: 医疗机构名称
- `valiFlag`: 有效性标志
- `drProTechDuty`: 医生专业技术职务
- `psnStas`: 人员状态
- `cntrBegntime`: 合同开始时间
- `cntrEndtime`: 合同结束时间
- `drCertCodg`: 医师资格证书编码
- `mainDept`: 主要科室
- `subDept`: 子科室
- `uuid`: 唯一标识UUID
- `submissionStatus`: 提交状态
- `belongDept`: 所属科室
- `timesign`: 时间戳

### 5. 数据传输对象包 (dto)

#### `MedicalInstitutionDTO.java`
**功能**: 医疗机构数据传输对象

**字段**: 与`MedicalInstitutionModel`相同，用于API接口的数据传输

#### `PharmacyInfoDTO.java`
**功能**: 药店数据传输对象

**字段**: 与`PharmacyInfoModel`相同，用于API接口的数据传输

### 6. 控制器包 (controller)

#### `AuthController.java`
**功能**: 认证控制器

**主要接口**:
- `POST /api/auth/login`: 用户登录
- `GET /api/auth/me`: 获取当前用户信息
- `GET /api/auth/roles`: 获取当前用户角色
- `POST /api/auth/logout`: 用户登出

**内部类**:
- `LoginRequest`: 登录请求DTO
- `LoginResponse`: 登录响应DTO

#### `MedicalInstitutionController.java`
**功能**: 医疗机构控制器

**主要接口**:
- `GET /api/medical-institution/select-all`: 获取所有医疗机构信息
- `GET /api/medical-institution/select-by-region`: 按区域获取医疗机构
- `GET /api/medical-institution/select-by-level`: 按等级获取医疗机构
- `GET /api/medical-institution/select-region-name`: 获取区域名称
- `GET /api/medical-institution/select-type-name`: 获取类型名称
- `POST /api/medical-institution/update-by-id`: 更新机构数据
- `POST /api/medical-institution/insert-by-id`: 增加机构数据
- `GET /api/medical-institution/select-by-ids`: 根据多个ID获取医疗机构
- `GET /api/medical-institution/search`: 按条件查询医疗机构

#### `RegionInfoController.java`
**功能**: 网格数据控制器

**主要接口**:
- `GET /api/region-info/select-all`: 获取网格数据
- `GET /api/region-info/select-region-population`: 获取人口数据
- `POST /api/region-info/update-csv`: 更新网格数据（CSV上传）
- `GET /api/region-info/division-geojson`: 获取行政区划GeoJSON数据
- `GET /api/region-info/hospital-three-geojson`: 获取三级医疗机构GeoJSON数据
- `GET /api/region-info/hospital-all-geojson`: 获取全部医疗机构GeoJSON数据
- `GET /api/region-info/hospital-two-geojson`: 获取二级医疗机构GeoJSON数据
- `GET /api/region-info/hospital-one-geojson`: 获取一级医疗机构GeoJSON数据
- `GET /api/region-info/hospital-nolevel-geojson`: 获取未定级医疗机构GeoJSON数据
- `GET /api/region-info/hospital-pha-geojson`: 获取定点药店GeoJSON数据
- `GET /api/region-info/hospital-nc-geojson`: 获取农村未定级医疗机构GeoJSON数据
- `GET /api/region-info/region-by-id/{regionId}`: 根据区域ID获取区域GeoJSON数据
- `GET /api/region-info/region-by-name/{regionName}`: 根据区域名称获取区域GeoJSON数据
- `GET /api/region-info/region-all`: 获取所有区域GeoJSON数据

### 7. 服务层包 (service)

#### `MedicalInstitutionService.java`
**功能**: 医疗机构服务类

**主要方法**:
- `getAllMedicalInstitutions()`: 查询所有医疗机构信息
- `getMedicalInstitutionsByRegion(String hospitalDistrict)`: 按区域获取医疗机构
- `getMedicalInstitutionsByLevel(String hospitalLevel)`: 按等级获取医疗机构
- `getRegionName()`: 获取区域名称
- `getTypeName()`: 获取类型名称
- `updateMedicalInstitutionById(MedicalInstitutionDTO dto)`: 更新机构数据
- `insertMedicalInstitution(MedicalInstitutionDTO dto)`: 插入机构数据
- `getMedicalInstitutionsByIds(List<Long> ids)`: 根据多个ID获取医疗机构
- `searchMedicalInstitutions(...)`: 按条件查询医疗机构

#### `SysAuthService.java`
**功能**: 系统认证服务类

**主要方法**:
- `login(String username, String password)`: 用户登录
- `getCurrentUser(String username)`: 获取当前用户信息
- `listUsers()`: 查询用户列表
- `createUser(SysUserModel user)`: 创建用户
- `updateUser(SysUserModel user)`: 修改用户信息
- `deleteUser(Long id)`: 删除用户
- `assignRoles(Long userId, List<Long> roleIds)`: 给用户分配角色
- `getUserRoles(Long userId)`: 查询用户角色
- `listRoles()`: 查询所有角色
- `verifyPassword(String username, String password)`: 验证用户密码
- `changeUserPassword(Long userId, String newPassword)`: 修改用户密码
- `createRole(SysRoleModel role)`: 创建角色
- `updateRole(SysRoleModel role)`: 更新角色信息
- `deleteRole(Long id)`: 删除角色

#### `RegionInfoService.java`
**功能**: 区域信息服务类

**主要方法**:
- `getAllRegionInfo()`: 获取所有区域信息
- `getRegionPopulation()`: 获取区域人口数据
- `updateRegionInfoFromCsv(MultipartFile file, String mode)`: 从CSV更新区域信息
- `divisionGeoJson()`: 获取行政区划GeoJSON数据
- `getRegionById(String regionId)`: 根据区域ID获取区域信息
- `getRegionByName(String regionName)`: 根据区域名称获取区域信息
- `getRegionAll()`: 获取所有区域信息

**辅助方法**:
- `parseGeometry(String geometryJson, String regionName)`: 解析几何图形数据

#### `MyUserDetailsService.java`
**功能**: 用户详情服务类（实现Spring Security的UserDetailsService）

**主要方法**:
- `loadUserByUsername(String username)`: 根据用户名加载用户详情

### 8. 工具类包 (utils)

#### `JwtUtil.java`
**功能**: JWT工具类

**主要方法**:
- `getUsernameFromToken(String token)`: 从token中获取用户名
- `getExpirationDateFromToken(String token)`: 从token中获取过期时间
- `getClaimFromToken(String token, Function<Claims, T> claimsResolver)`: 从token中获取指定声明
- `isTokenExpired(String token)`: 检查token是否过期
- `generateToken(UserDetails userDetails)`: 为用户生成token
- `createToken(Map<String, Object> claims, String subject)`: 创建token
- `validateToken(String token, UserDetails userDetails)`: 验证token
- `validateToken(String token)`: 验证token是否有效
- `parseJwt(String authHeader)`: 从请求头中解析token

#### `AuthTokenFilter.java`
**功能**: JWT认证过滤器

**主要方法**:
- `doFilterInternal(...)`: 过滤器核心逻辑
- `parseJwt(HttpServletRequest request)`: 从请求头中解析JWT token

#### `GeoJsonConverter.java`
**功能**: GeoJSON转换工具类

**主要方法**:
- `convertToGeometryCollection(Map<String, String> geometryMap)`: 将Map格式的geometry JSON转换为GeometryCollection

#### `GeoJsonExporter.java`
**功能**: GeoJSON导出工具类

**主要方法**:
- `geometryToGeoJson(Geometry geometry)`: 将几何图形转换为GeoJSON格式

#### `ScheduledTasks.java`
**功能**: 定时任务类

**主要功能**:
- 项目启动后5秒执行初始化任务
- 执行各种数据插入任务（目前大部分被注释）

### 9. 数据访问层包 (mapper)

#### `MedicalInstitutionMapper.java`
**功能**: 医疗机构数据访问接口

**主要方法**:
- `getAllMedicalInstitutions()`: 查询所有医疗机构信息
- `getMedicalInstitutionsByRegion(String hospitalDistrict)`: 按区域查询医疗机构
- `getMedicalInstitutionsByLevel(String hospitalLevel)`: 按等级查询医疗机构
- `getRegionName()`: 获取区域名称
- `getTypeName()`: 获取类型名称
- `updateMedicalInstitutionById(MedicalInstitutionDTO dto)`: 更新机构数据
- `insertMedicalInstitution(MedicalInstitutionDTO dto)`: 插入机构数据
- `getMedicalInstitutionsByIds(List<Long> ids)`: 根据多个ID查询医疗机构
- `searchMedicalInstitutions(...)`: 按条件查询医疗机构
- `getMedInstitutionOne()`: 查询一级医疗机构数量
- `getMedInstitutionTwo()`: 查询二级医疗机构数量
- `getMedInstitutionThree()`: 查询三级医疗机构数量
- `getMedInstitutionOther()`: 查询其他级别医疗机构数量
- `getMedInstitutionRegion()`: 按地区查询医疗机构数量
- `getMedicalNC()`: 查询农村医疗机构
- `getMedInsByHospitalId(String hospitalId)`: 根据医院ID查询医疗机构

## 系统特性

### 1. 多数据源支持
- 系统配置了7个独立的MySQL数据源
- 每个数据源对应不同的业务模块
- 使用MyBatis Plus进行数据访问

### 2. 安全认证
- 基于Spring Security + JWT的无状态认证
- 支持用户角色权限管理
- 密码使用BCrypt加密

### 3. 地理信息处理
- 集成JTS和GeoTools库
- 支持GeoJSON格式的地理数据处理
- 提供地理坐标转换和合并功能

### 4. API文档
- 使用Knife4j提供Swagger API文档
- 支持在线API测试
- 完整的接口参数说明

### 5. 定时任务
- 支持定时数据更新
- 项目启动时自动执行初始化任务

### 6. 统一响应格式
- 使用Result类统一封装API响应
- 支持成功、失败、未授权等多种响应状态

## 部署说明

### 环境要求
- JDK 17+
- MySQL 8.0+
- Maven 3.6+

### 配置说明
1. 修改`application.properties`中的数据库连接信息
2. 配置JWT密钥和过期时间
3. 根据需要调整端口号

### 启动方式
```bash
mvn spring-boot:run
```

### 访问地址
- 应用地址: http://localhost:8087
- API文档: http://localhost:8087/doc.html

## API接口文档

### 认证接口

#### 用户登录
- **URL**: `POST /api/auth/login`
- **描述**: 通过用户名和密码登录系统，并返回JWT Token
- **请求体**:
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "eyJhbGciOiJIUzUxMiJ9...",
      "user": {
        "id": 1,
        "username": "admin",
        "nickname": "系统管理员"
      }
    },
    "timestamp": 1640995200000
  }
  ```

#### 获取当前用户信息
- **URL**: `GET /api/auth/me`
- **描述**: 获取当前登录用户的详细信息
- **请求头**: `Authorization: Bearer <token>`
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取用户信息成功",
    "data": {
      "id": 1,
      "username": "admin",
      "nickname": "系统管理员",
      "email": "admin@example.com"
    },
    "timestamp": 1640995200000
  }
  ```

### 医疗机构接口

#### 获取所有医疗机构信息
- **URL**: `GET /api/medical-institution/select-all`
- **描述**: 获取所有医疗机构信息
- **响应**:
  ```json
  [
    {
      "id": 1,
      "hospitalId": "H34020200008",
      "hospitalName": "芜湖市第三人民医院",
      "hospitalAddress": "镜湖区棠梅路190号",
      "hospitalLevel": "二级",
      "approvedBed": 160,
      "openBed": 160
    }
  ]
  ```

#### 按区域获取医疗机构
- **URL**: `GET /api/medical-institution/select-by-region`
- **参数**: `hospitalDistrict` (行政区划)
- **示例**: `GET /api/medical-institution/select-by-region?hospitalDistrict=镜湖区`

#### 按等级获取医疗机构
- **URL**: `GET /api/medical-institution/select-by-level`
- **参数**: `hospitalLevel` (医疗机构等级)
- **示例**: `GET /api/medical-institution/select-by-level?hospitalLevel=二级`

#### 按条件查询医疗机构
- **URL**: `GET /api/medical-institution/search`
- **参数**:
  - `hospitalId` (可选): 机构id
  - `hospitalName` (可选): 机构名称（模糊）
  - `hospitalLevel` (可选): 机构等级
  - `hospitalDistrict` (可选): 行政区划
- **示例**: `GET /api/medical-institution/search?hospitalName=医院&hospitalLevel=二级`

### 区域信息接口

#### 获取网格数据
- **URL**: `GET /api/region-info/select-all`
- **描述**: 获取所有网格数据
- **响应**:
  ```json
  [
    {
      "id": 1,
      "regionId": "340202012000",
      "regionName": "方塘居委会",
      "villageCommunity": "方村街道",
      "regionPopulation": "2071",
      "townStreet": "方村街道",
      "countyDistrict": "镜湖区"
    }
  ]
  ```

#### 获取行政区划GeoJSON数据
- **URL**: `GET /api/region-info/division-geojson`
- **描述**: 获取行政区划GeoJSON数据
- **响应**: GeoJSON格式的地理数据

#### 获取医疗机构GeoJSON数据
- **URL**: `GET /api/region-info/hospital-{level}-geojson`
- **参数**: `district` (可选), `isMetro` (可选)
- **示例**:
  - `GET /api/region-info/hospital-three-geojson?district=镜湖区`
  - `GET /api/region-info/hospital-all-geojson`
  - `GET /api/region-info/hospital-pha-geojson?district=镜湖区&isMetro=true`

## 数据库设计

### 主要数据表

#### 医疗机构表 (theme_ddmedical_institutions_info)
```sql
CREATE TABLE medical_institution (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    hospital_id VARCHAR(50) NOT NULL COMMENT '医疗机构ID',
    hospital_name VARCHAR(200) NOT NULL COMMENT '医疗机构名称',
    hospital_address VARCHAR(500) COMMENT '医疗机构地址',
    hospital_level VARCHAR(50) COMMENT '医疗机构等级',
    approved_bed INT COMMENT '核定床位数',
    open_bed INT COMMENT '开放床位数',
    hospital_departments TEXT COMMENT '医疗机构科室',
    hospital_description TEXT COMMENT '医疗机构简介',
    hospital_district VARCHAR(100) COMMENT '医疗机构所属区域',
    business_nature VARCHAR(100) COMMENT '医疗机构经营性质',
    hospital_longitude VARCHAR(50) COMMENT '经度',
    hospital_latitude VARCHAR(50) COMMENT '纬度',
    start_date VARCHAR(20) COMMENT '开始生效时间',
    end_date VARCHAR(20) COMMENT '结束生效时间',
    sign VARCHAR(20) COMMENT '农村/城市标识',
    doctor_num INT COMMENT '医生数量'
);
```

#### 区域信息表 (theme_region)
```sql
CREATE TABLE region_info (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id VARCHAR(50) NOT NULL COMMENT '区域ID',
    region_name VARCHAR(200) NOT NULL COMMENT '区域名称',
    village_community VARCHAR(200) COMMENT '所属村居',
    region_population VARCHAR(50) COMMENT '人口',
    town_street VARCHAR(200) COMMENT '镇街',
    county_district VARCHAR(100) COMMENT '县区',
    geometry TEXT COMMENT '网格坐标集合',
    region_include TEXT COMMENT '包含的小区块'
);
```

#### 用户表 (theme_auth)
```sql
CREATE TABLE sys_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(200) NOT NULL COMMENT '密码',
    nickname VARCHAR(100) COMMENT '昵称',
    email VARCHAR(100) COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '手机号',
    status INT DEFAULT 1 COMMENT '状态(1启用,0禁用)',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
);
```

#### 角色表 (theme_auth)
```sql
CREATE TABLE sys_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE COMMENT '角色英文名',
    role_label VARCHAR(100) COMMENT '角色中文描述',
    status INT DEFAULT 1 COMMENT '状态(1启用,0禁用)',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
);
```

## 开发指南

### 项目结构
```
src/main/java/org/a7s/whyb_wjdc/
├── common/           # 通用类
├── config/           # 配置类
├── controller/       # 控制器
├── dto/             # 数据传输对象
├── mapper/          # 数据访问层
│   ├── db1/         # 数据库1的Mapper
│   ├── db2/         # 数据库2的Mapper
│   └── ...          # 其他数据库的Mapper
├── model/           # 实体类
├── security/        # 安全相关
├── service/         # 服务层
├── utils/           # 工具类
└── WhybWjdcApplication.java  # 主启动类
```

### 开发规范

#### 1. 命名规范
- 类名使用大驼峰命名法 (PascalCase)
- 方法名和变量名使用小驼峰命名法 (camelCase)
- 常量使用全大写，下划线分隔 (UPPER_SNAKE_CASE)
- 包名使用全小写，点分隔

#### 2. 注解使用
- 实体类使用 `@Data` 和 `@Schema`
- 控制器使用 `@RestController` 和 `@RequestMapping`
- 服务类使用 `@Service` 和 `@Transactional`
- Mapper接口使用 `@Mapper`

#### 3. 异常处理
- 使用统一的 `Result` 类封装响应
- 在Service层处理业务异常
- 在Controller层捕获异常并返回统一格式

#### 4. 日志规范
- 使用 `@Slf4j` 注解
- 关键操作记录INFO级别日志
- 异常情况记录ERROR级别日志
- 调试信息记录DEBUG级别日志

### 扩展开发

#### 添加新的数据源
1. 在 `application.properties` 中配置新的数据源
2. 创建对应的 `DbXMyBatisConfig.java` 配置类
3. 在 `mapper` 包下创建对应的子包
4. 创建对应的Mapper接口和XML文件

#### 添加新的业务模块
1. 创建Model实体类
2. 创建DTO数据传输对象
3. 创建Mapper接口和XML文件
4. 创建Service服务类
5. 创建Controller控制器类
6. 添加相应的API文档注解

## 总结

这是一个功能完整的医疗数据查询系统，具有以下特点：

1. **架构清晰**: 采用分层架构，职责分离明确
2. **技术先进**: 使用Spring Boot 3.x最新技术栈
3. **功能丰富**: 支持医疗机构、药店、区域信息等多种数据查询
4. **安全可靠**: 集成Spring Security和JWT认证
5. **扩展性强**: 多数据源设计，易于扩展新功能
6. **文档完善**: 提供完整的API文档和代码注释

系统主要用于芜湖地区的医疗数据管理和查询，为医疗决策提供数据支持。

---

**文档版本**: 1.0  
**最后更新**: 2025年1月  
**维护人员**: 开发团队
