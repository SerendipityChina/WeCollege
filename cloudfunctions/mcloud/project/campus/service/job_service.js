/**
 * Notes: 兼职模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2024-03-23 04:00:00 
 */

const BaseProjectService = require('./base_project_service.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const util = require('../../../framework/utils/util.js');
const cloudUtil = require('../../../framework/cloud/cloud_util.js');
const JobModel = require('../model/job_model.js');
const UserModel = require('../model/user_model.js');

class JobService extends BaseProjectService {

	/** 点赞 */
	async likeJob(userId, id) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 浏览 */
	async viewJob(userId, id) {
		let fields = '*';

		let where = {
			_id: id,
			//JOB_STATUS: 1
		}

		if (userId && util.isDefined(where.JOB_STATUS)) delete where.JOB_STATUS;

		let job = await JobModel.getOne(where, fields);
		if (!job) return null;

		JobModel.inc(id, 'JOB_VIEW_CNT', 1);

		return job;
	}

	/** 获取 */
	async getJobDetail(id) {
		return await JobModel.getOne(id);
	}

	/** 修改状态 */
	async statusJob(userId, id, status) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

	/** 删除 */
	async delJob(userId, id) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 插入 */
	async insertJob(userId, {
		cateId,
		cateName,
		order,
		forms
	}) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 修改 */
	async editJob(userId, {
		id,
		cateId,
		cateName,
		order,
		forms
	}) {

		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 更新forms信息 */
	async updateJobForms({
		id,
		hasImageForms
	}) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 列表与搜索 */
	async getJobList(userId, {
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal }) {
		orderBy = orderBy || {
			'JOB_ORDER': 'asc',
			'JOB_ADD_TIME': 'desc'
		};
		let fields = 'JOB_ORDER,JOB_CATE_ID,JOB_CATE_NAME,JOB_STATUS,JOB_COMMENT_CNT,JOB_VIEW_CNT,JOB_FAV_CNT,JOB_FAV_LIST,JOB_LIKE_CNT,JOB_LIKE_LIST,JOB_ADD_TIME,JOB_USER_ID,JOB_OBJ,user.USER_NAME,user.USER_PIC';

		let where = {};
		where.and = {
			//JOB_STATUS: 1,
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};


		if (util.isDefined(search) && search) {
			if (search == '我发布的职位') {
				where.and.JOB_USER_ID = userId;
			}
			else if (search == '我的点赞') {
				where.and.JOB_LIKE_LIST = userId;
			}
			else if (search == '我的收藏') {
				where.and.JOB_FAV_LIST = userId;
			}
			else {
				where.or = [
					{ 'JOB_CATE_NAME': ['like', search] },
					{ 'JOB_OBJ.title': ['like', search] },
					{ 'JOB_OBJ.company': ['like', search] },
					{ 'JOB_OBJ.address': ['like', search] },
					{ 'JOB_OBJ.desc': ['like', search] },
					{ 'JOB_OBJ.poster': ['like', search] },
					{ 'JOB_OBJ.tel': ['like', search] },
					{ 'JOB_OBJ.wx': ['like', search] },
				];
			}

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId': {
					where.and.JOB_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.JOB_STATUS = Number(sortVal);
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'JOB_ADD_TIME');
					break;
				}
				case 'fav': {
					orderBy = {
						'JOB_FAV_CNT': 'desc',
						'JOB_ADD_TIME': 'desc'
					}
					break;
				}
				case 'comment': {
					orderBy = {
						'JOB_COMMENT_CNT': 'desc',
						'JOB_ADD_TIME': 'desc'
					}
					break;
				}
				case 'like': {
					orderBy = {
						'JOB_LIKE_CNT': 'desc',
						'JOB_ADD_TIME': 'desc'
					}
					break;
				}
				case 'today': {
					where.and.JOB_DAY = timeUtil.time('Y-M-D');
					break;
				}
				case 'yesterday': {
					where.and.JOB_DAY = timeUtil.time('Y-M-D', -86400);
					break;
				}
			}
		}

		let joinParams = {
			from: UserModel.CL,
			localField: 'JOB_USER_ID',
			foreignField: 'USER_MINI_OPENID',
			as: 'user',
		};

		return await JobModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);

	}

}

module.exports = JobService;