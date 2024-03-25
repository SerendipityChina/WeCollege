/**
 * Notes: 样片模块业务逻辑
 */

const BaseProjectService = require('./base_project_service.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const util = require('../../../framework/utils/util.js');
const cloudUtil = require('../../../framework/cloud/cloud_util.js');
const CommentModel = require('../model/comment_model.js');
const UserModel = require('../model/user_model.js');

class CommentService extends BaseProjectService {

	/** 点赞 */
	async likeComment(userId, id) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	async statComment(oid, type) {
		let PREFIX = type.toUpperCase();
		let name = type.toLowerCase();

		let cnt = await CommentModel.count({ COMMENT_OID: oid, COMMENT_TYPE: type });
		let Model = require('../model/' + name + '_model.js');

		await Model.edit(oid, { [PREFIX + '_COMMENT_CNT']: cnt });
	}

	async delComment(userId, id, type) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	async insertComment(userId, {
		oid,
		type,
		forms
	}) {

		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	// 更新forms信息
	async updateCommentForms({
		id,
		hasImageForms
	}) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

	async getCommentList(userId, {
		oid,
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
			'COMMENT_ADD_TIME': 'desc'
		};
		let fields = 'COMMENT_LIKE_CNT,COMMENT_LIKE_LIST,COMMENT_ADD_TIME,COMMENT_USER_ID,COMMENT_OBJ,user.USER_NAME,user.USER_PIC,user.USER_OBJ.sex';


		let where = {};
		where.and = {
			COMMENT_OID: oid,
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};


		if (util.isDefined(search) && search) {
			where.or = [
				{ 'COMMENT_OBJ.content': ['like', search] },
				{ 'user.USER_NAME': ['like', search] },
			];


		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'COMMENT_ADD_TIME');
					break;
				}
				case 'like': {
					orderBy = {
						'COMMENT_LIKE_CNT': 'desc',
						'COMMENT_ADD_TIME': 'desc'
					}
					break;
				}
				case 'mycomment': {
					where.and.COMMENT_USER_ID = userId;
					break;
				}
				case 'mylike': {
					where.and.COMMENT_LIKE_LIST = userId;
					break;
				}

			}
		}

		let joinParams = {
			from: UserModel.CL,
			localField: 'COMMENT_USER_ID',
			foreignField: 'USER_MINI_OPENID',
			as: 'user',
		};

		return await CommentModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

}

module.exports = CommentService;