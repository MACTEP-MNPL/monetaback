import { Menu } from "@grammyjs/menu";
import { db } from "../../index.js";
import { getRussianApplicatoinType } from "../utils/getRussianApplicatoinType.js";
import { getApplicationMessage } from "../messages/messages.js";

const ITEMS_PER_PAGE = 5;

// Helper function to build the SQL query with filters
const buildFilteredQuery = (filters) => {
    let query = `
        SELECT a.*, c.invite_link 
        FROM applications a 
        JOIN chats c ON a.chat_id = c.chat_id 
        WHERE 1=1
    `;
    const params = [];

    if (filters.type) {
        query += " AND a.type = ?";
        params.push(filters.type);
    }

    if (filters.status) {
        query += " AND a.status = ?";
        params.push(filters.status);
    }

    if (filters.dateFrom) {
        query += " AND a.created_at >= ?";
        params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
        query += " AND a.created_at <= ?";
        params.push(filters.dateTo);
    }

    query += " ORDER BY a.created_at DESC";
    return { query, params };
};

const getApplications = async (ctx, buttons, page = 1, filters = {}) => {
    try {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        
        // Build query with filters
        const { query, params } = buildFilteredQuery(filters);
        const paginatedQuery = `${query} LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
        
        // Get filtered applications with pagination
        const [applications] = await db.execute(paginatedQuery, params);
        
        // Get total count for pagination
        const [countResult] = await db.execute(
            `SELECT COUNT(*) as total FROM (${query}) as filtered`,
            params
        );
        const totalApplications = countResult[0].total;
        const totalPages = Math.ceil(totalApplications / ITEMS_PER_PAGE);

        // Clear previous buttons
        buttons.text("🔄 Обновить", (ctx) => {
            ctx.menu.update();
        }).row();

        // Filter buttons
        buttons.text("📅 Фильтр по дате", async (ctx) => {
            await ctx.conversation.enter("filterByDateConversation");
        })
        .text("🏷 Фильтр по типу", async (ctx) => {
            await ctx.conversation.enter("filterByTypeConversation");
        }).row();

        // Display applications
        for (const app of applications) {
            const type = getRussianApplicatoinType(app.type);
            const date = new Date(app.created_at).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });

            buttons.text(
                `#${app.id} ${type} ${date}`,
                async (ctx) => {
                    const { text, keyboard } = await getApplicationMessage(app.id);
                    await ctx.reply(text, { 
                        parse_mode: 'HTML',
                        reply_markup: keyboard
                    });
                }
            ).row();
        }

        // Pagination controls
        if (totalPages > 1) {
            const paginationRow = [];
            
            if (page > 1) {
                paginationRow.push(buttons.text("⬅️", (ctx) => {
                    ctx.session.currentPage = page - 1;
                    ctx.menu.update();
                }));
            }
            
            paginationRow.push(buttons.text(
                `${page}/${totalPages}`,
                (ctx) => ctx.reply("Текущая страница")
            ));
            
            if (page < totalPages) {
                paginationRow.push(buttons.text("➡️", (ctx) => {
                    ctx.session.currentPage = page + 1;
                    ctx.menu.update();
                }));
            }
            
            buttons.row(...paginationRow);
        }

        // Reset filters button
        if (Object.keys(filters).length > 0) {
            buttons.text("❌ Сбросить фильтры", (ctx) => {
                ctx.session.filters = {};
                ctx.session.currentPage = 1;
                ctx.menu.update();
            }).row();
        }
        
    } catch (error) {
        console.error('Error in getApplications:', error);
        buttons.text("⚠️ Ошибка загрузки", (ctx) => {
            ctx.menu.update();
        }).row();
    }
};

export const getAllApplicationsMenu = new Menu("getAllApplications");

getAllApplicationsMenu.dynamic((ctx, range) => {
    const page = ctx.session.currentPage || 1;
    const filters = ctx.session.filters || {};
    console.log(ctx.session, page, filters)
    return getApplications(ctx, range, page, filters);
});
